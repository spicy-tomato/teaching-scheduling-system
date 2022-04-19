import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './requests.page.actions';
import * as ApiAction from './requests.api.actions';
import * as fromRequests from '.';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { ScheduleService } from '@services/schedule.service';
import {
  ChangeScheduleOptions,
  ChangeScheduleSearch,
  Nullable,
  RequestChangeScheduleCode,
  SimpleModel,
} from '@shared/models';
import { Store } from '@ngrx/store';
import {
  DateHelper,
  ObjectHelper,
  ObservableHelper,
  UrlHelper,
} from '@shared/helpers';
import { CoreConstant, PermissionConstant } from '@shared/constants';
import { TeacherService } from '@services/teacher.service';
import assert from 'assert';

@Injectable()
export class RequestsEffects {
  /** PRIVATE PROPERTIES */
  private personal!: boolean;

  private readonly options$: Observable<ChangeScheduleOptions>;
  private readonly department$: Observable<Nullable<SimpleModel>>;
  private readonly loadSubject$ = new Subject<ChangeScheduleSearch>();
  private readonly permissions$ = this.appShellStore.select(
    fromAppShell.selectPermission
  );
  private readonly teacher$ = this.appShellStore.pipe(
    fromAppShell.selectNotNullTeacher
  );

  /** EFFECTS */
  public reset$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PageAction.reset),
        tap(({ personal }) => {
          this.personal = personal;
        })
      );
    },
    { dispatch: false }
  );

  public loadChangeSchedules$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PageAction.filter),
        tap(({ query }) => {
          this.loadSubject$.next(query);
        })
      );
    },
    { dispatch: false }
  );

  public loadTeacher$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.loadTeachersList),
      mergeMap(({ dep }) => {
        return this.teacherService.getByDepartment(dep).pipe(
          map((r) => r.data),
          map((teachers) => {
            return ApiAction.loadTeachersListSuccessful({ teachers });
          }),
          catchError(() => of(ApiAction.loadTeachersListFailure()))
        );
      })
    );
  });

  public changeSelectedStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.changeOptions),
      map((x) => ({
        status: x.options.status,
        teacherId: x.options.teacher?.id,
      })),
      withLatestFrom(this.permissions$),
      mergeMap(([{ status, teacherId }, permissions]) => {
        const _status = this.getQueryForStatus(status, permissions);

        return of(
          PageAction.filter({
            query: {
              status: _status,
              teacherId,
              page: 1,
              pagination: 20,
            },
          })
        );
      })
    );
  });

  public changePage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.changePage),
      withLatestFrom(this.permissions$),
      mergeMap(([{ page }, permissions]) => {
        return this.options$.pipe(
          map(({ status, teacher }) => {
            const _status = this.getQueryForStatus(status, permissions);

            return PageAction.filter({
              query: {
                status: _status,
                teacherId: teacher?.id,
                page: page + 1,
                pagination: 20,
              },
            });
          }),
          take(1)
        );
      })
    );
  });

  public accept$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.accept),
      mergeMap(({ schedule }) => {
        const { id } = schedule;
        const acceptedAt = DateHelper.toSqlDate(new Date());

        return this.scheduleService
          .acceptChangeScheduleRequests(id, { acceptedAt })
          .pipe(
            map((r) =>
              ApiAction.acceptSuccessful({ id, status: r.data.status })
            ),
            catchError(() => of(ApiAction.acceptFailure()))
          );
      })
    );
  });

  public setRoom$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.setRoom),
      mergeMap(({ schedule, newIdRoom }) => {
        const { id } = schedule;
        const setRoomAt = DateHelper.toSqlDate(new Date());

        return this.scheduleService
          .setRoomChangeScheduleRequests(id, {
            newIdRoom,
            setRoomAt,
          })
          .pipe(
            map(() => ApiAction.setRoomSuccessful({ id, room: newIdRoom })),
            catchError(() => of(ApiAction.setRoomFailure()))
          );
      })
    );
  });

  public deny$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.deny),
      mergeMap(({ schedule, reason }) => {
        const { id } = schedule;

        return this.scheduleService
          .denyChangeScheduleRequests(id, {
            reasonDeny: reason,
          })
          .pipe(
            map((r) => ApiAction.denySuccessful({ id, status: r.data.status })),
            catchError(() => of(ApiAction.denyFailure()))
          );
      })
    );
  });

  public cancel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.cancel),
      mergeMap(({ id }) => {
        return this.scheduleService.cancelChangeScheduleRequests(id).pipe(
          map(() => ApiAction.cancelSuccessful({ id })),
          catchError(() => of(ApiAction.cancelFailure()))
        );
      })
    );
  });

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly teacherService: TeacherService,
    private readonly scheduleService: ScheduleService,
    private readonly store: Store<fromRequests.RequestsState>,
    private readonly appShellStore: Store<fromAppShell.AppShellState>
  ) {
    this.options$ = store.select(fromRequests.selectOptions);
    this.department$ = appShellStore.select(fromAppShell.selectDepartment);

    this.handleLoadPersonal();
    this.handleLoadDepartment();
    this.handleLoadManager();
  }

  /** PRIVATE METHODS */
  private handleLoadPersonal(): void {
    this.loadSubject$
      .pipe(
        filter(() => this.personal),
        ObservableHelper.filterWith(
          this.permissions$,
          PermissionConstant.SEE_PERSONAL_CHANGE_SCHEDULE_REQUESTS
        ),
        withLatestFrom(this.teacher$),
        mergeMap(([x, teacher]) => {
          return this.scheduleService
            .getPersonalChangeScheduleRequests(
              teacher.id,
              UrlHelper.queryFilter(
                x,
                {
                  status: 'in',
                },
                {
                  include: {
                    id: {
                      sort: 'desc',
                    },
                  },
                  exclude: ['teacherId'],
                }
              )
            )
            .pipe(
              tap((changeSchedules) => {
                this.store.dispatch(
                  ApiAction.filterSuccessful({
                    changeSchedulesResponse: changeSchedules,
                  })
                );
              }),
              catchError(() =>
                of(this.store.dispatch(ApiAction.filterFailure()))
              )
            );
        })
      )
      .subscribe();
  }

  private handleLoadDepartment(): void {
    combineLatest([
      this.department$.pipe(ObservableHelper.filterNullish()),
      this.loadSubject$,
    ])
      .pipe(
        filter(() => !this.personal),
        ObservableHelper.filterWith(
          this.permissions$,
          PermissionConstant.SEE_DEPARTMENT_CHANGE_SCHEDULE_REQUESTS
        ),
        map(([department, params]) => ({
          department: department.id,
          params,
        })),
        mergeMap(({ department, params }) => {
          return this.scheduleService
            .getDepartmentChangeScheduleRequests(
              department,
              UrlHelper.queryFilter(
                params,
                {
                  status: 'in',
                },
                {
                  include: {
                    id: {
                      sort: 'desc',
                    },
                  },
                }
              )
            )
            .pipe(
              tap((changeSchedules) => {
                this.store.dispatch(
                  ApiAction.filterSuccessful({
                    changeSchedulesResponse: changeSchedules,
                  })
                );
              }),
              catchError(() =>
                of(this.store.dispatch(ApiAction.filterFailure()))
              )
            );
        })
      )
      .subscribe();
  }

  private handleLoadManager(): void {
    this.loadSubject$
      .pipe(
        filter(() => !this.personal),
        ObservableHelper.filterWith(
          this.permissions$,
          PermissionConstant.SEE_CHANGE_SCHEDULE_REQUESTS_FOR_ROOM_MANAGER
        ),
        mergeMap((x) => {
          return this.scheduleService
            .getManagerChangeScheduleRequests(
              UrlHelper.queryFilter(
                x,
                {
                  status: 'equal',
                },
                {
                  include: {
                    id: {
                      sort: 'desc',
                    },
                  },
                  exclude: ['teacherId'],
                }
              )
            )
            .pipe(
              tap((changeSchedules) => {
                this.store.dispatch(
                  ApiAction.filterSuccessful({
                    changeSchedulesResponse: changeSchedules,
                  })
                );
              }),
              catchError(() =>
                of(this.store.dispatch(ApiAction.filterFailure()))
              )
            );
        })
      )
      .subscribe();
  }

  private getQueryForStatus(
    status: Nullable<RequestChangeScheduleCode> | undefined,
    permissions: number[]
  ): RequestChangeScheduleCode[] {
    if (ObjectHelper.isNullOrUndefined(status)) {
      return [];
    }

    assert(status !== null && status !== undefined);
    const statusDetails = CoreConstant.REQUEST_CHANGE_SCHEDULE_STATUS[status];

    if (!statusDetails.mergeWith) {
      return [status];
    }

    const statusList: RequestChangeScheduleCode[] = [];
    [status, ...statusDetails.mergeWith].forEach((s) => {
      const sDetails = CoreConstant.REQUEST_CHANGE_SCHEDULE_STATUS[s];
      if (sDetails.feature === null || permissions.includes(sDetails.feature)) {
        statusList.push(s);
      }
    });

    return statusList;
  }
}
