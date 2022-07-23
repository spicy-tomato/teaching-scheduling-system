import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PermissionConstant } from '@teaching-scheduling-system/core/data-access/constants';
import {
  Nullable,
  RequestChangeScheduleCode,
} from '@teaching-scheduling-system/core/data-access/models';
import {
  DateHelper,
  ObjectHelper,
  ObservableHelper,
  UrlHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import { ChangeScheduleSearch } from '@teaching-scheduling-system/web/shared/data-access/models';
import { ScheduleService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectDepartment,
  selectNotNullTeacher,
  selectPermission,
  selectTeachersInDepartment,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { ScheduleConstant } from '@teaching-scheduling-system/web/shared/utils/constants';
import {
  catchError,
  combineLatest,
  filter,
  map,
  mergeMap,
  of,
  Subject,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import * as ApiAction from './requests.api.actions';
import * as PageAction from './requests.page.actions';
import { teachingScheduleRequestSelectOptions } from './requests.selectors';
import { TeachingScheduleRequestState } from './requests.state';

@Injectable()
export class TeachingScheduleRequestEffects {
  /** PRIVATE PROPERTIES */
  private personal!: boolean;

  private readonly loadSubject$ = new Subject<ChangeScheduleSearch>();
  private readonly options$ = this.store.select(
    teachingScheduleRequestSelectOptions
  );
  private readonly department$ = this.appShellStore.select(selectDepartment);
  private readonly permissions$ = this.appShellStore.select(selectPermission);
  private readonly teacher$ = this.appShellStore.pipe(selectNotNullTeacher);
  private readonly teachersInDepartment$ = this.appShellStore.select(
    selectTeachersInDepartment
  );

  /** EFFECTS */
  public reset$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PageAction.teachingScheduleRequestReset),
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
        ofType(PageAction.teachingScheduleRequestFilter),
        tap(({ query }) => {
          this.loadSubject$.next(query);
        })
      );
    },
    { dispatch: false }
  );

  public changeSelectedStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingScheduleRequestChangeOptions),
      map((x) => ({
        status: x.options.status,
        teacherId: x.options.teacher?.id,
      })),
      withLatestFrom(this.permissions$),
      mergeMap(([{ status, teacherId }, permissions]) => {
        const _status = this.getQueryForStatus(status, permissions);

        return of(
          PageAction.teachingScheduleRequestFilter({
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
      ofType(PageAction.teachingScheduleRequestChangePage),
      withLatestFrom(this.permissions$),
      mergeMap(([{ page }, permissions]) => {
        return this.options$.pipe(
          map(({ status, teacher }) => {
            const _status = this.getQueryForStatus(status, permissions);

            return PageAction.teachingScheduleRequestFilter({
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
      ofType(PageAction.teachingScheduleRequestAccept),
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
      ofType(PageAction.teachingScheduleRequestSetRoom),
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
      ofType(PageAction.teachingScheduleRequestDeny),
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
      ofType(PageAction.teachingScheduleRequestCancel),
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
    private readonly scheduleService: ScheduleService,
    private readonly store: Store<TeachingScheduleRequestState>,
    private readonly appShellStore: Store<AppShellState>
  ) {
    this.options$;

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

    const statusDetails =
      ScheduleConstant.REQUEST_CHANGE_SCHEDULE_STATUS[status];

    if (!statusDetails.mergeWith) {
      return [status];
    }

    const statusList: RequestChangeScheduleCode[] = [];
    [status, ...statusDetails.mergeWith].forEach((s) => {
      const sDetails = ScheduleConstant.REQUEST_CHANGE_SCHEDULE_STATUS[s];
      if (sDetails.feature === null || permissions.includes(sDetails.feature)) {
        statusList.push(s);
      }
    });

    return statusList;
  }
}
