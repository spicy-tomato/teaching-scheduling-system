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
  SimpleModel,
} from '@shared/models';
import { Store } from '@ngrx/store';
import {
  DateHelper,
  ObservableHelper,
  PermissionHelper,
} from '@shared/helpers';

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

  public load$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PageAction.load),
        tap(({ query }) => {
          this.loadSubject$.next(query);
        })
      );
    },
    { dispatch: false }
  );

  public changeSelectedStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.changeOptions),
      map((x) => x.options.selectedStatus),
      ObservableHelper.filterUndefined(),
      mergeMap((_status) => {
        const status =
          _status === null ? 'all' : _status == 2 ? '2,3' : _status;

        return of(
          PageAction.load({
            query: {
              status,
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
      mergeMap(({ page }) => {
        return this.options$.pipe(
          map(({ selectedStatus: _status }) => {
            const status =
              _status === null ? 'all' : _status == 2 ? '2,3' : _status;

            return PageAction.load({
              query: {
                status,
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
        const status = schedule.newSchedule.room ? 3 : 1;
        const time = DateHelper.toSqlDate(new Date());

        return this.scheduleService
          .responseChangeScheduleRequests({
            id,
            status,
            time,
          })
          .pipe(
            map(() => ApiAction.acceptSuccessful({ id, status })),
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
        const status = 2;
        const time = DateHelper.toSqlDate(new Date());

        return this.scheduleService
          .responseChangeScheduleRequests({
            id,
            status,
            time,
            newIdRoom,
          })
          .pipe(
            map(() =>
              ApiAction.setRoomSuccessful({ id, status, room: newIdRoom })
            ),
            catchError(() => of(ApiAction.setRoomFailure()))
          );
      })
    );
  });

  public deny$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.deny),
      withLatestFrom(this.permissions$),
      mergeMap(([{ schedule, reason }, permissions]) => {
        const { id } = schedule;
        const isTeacher = PermissionHelper.isTeacher(permissions);
        const status = isTeacher ? -1 : -2;
        const time = DateHelper.toSqlDate(new Date());

        return this.scheduleService
          .responseChangeScheduleRequests({
            id,
            status,
            time,
            reasonDeny: reason,
          })
          .pipe(
            map(() => ApiAction.denySuccessful({ id, status })),
            catchError(() => of(ApiAction.denyFailure()))
          );
      })
    );
  });

  public cancel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.cancel),
      mergeMap(({ id }) => {
        return this.scheduleService
          .cancelChangeScheduleRequests({
            id,
            status: -3,
          })
          .pipe(
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
    private readonly store: Store<fromRequests.RequestsState>,
    private readonly appShellStore: Store<fromAppShell.AppShellState>
  ) {
    this.options$ = store.select(fromRequests.selectOptions);
    this.department$ = appShellStore.select(fromAppShell.selectDepartment);

    this.handlePermissionChange();
  }

  /** PRIVATE METHODS */
  private handlePermissionChange(): void {
    this.permissions$
      .pipe(
        filter((permissions) => permissions.length > 0),
        tap((permissions) => {
          const role = PermissionHelper.getRole(permissions);
          switch (role) {
            case 'teacher':
              this.handleLoadPersonal();
              break;
            case 'departmentHead':
              this.handleLoadPersonal();
              this.handleLoadDepartment();
              break;
            case 'roomManager':
              this.handleLoadManager();
              break;
          }
        }),
        take(1)
      )
      .subscribe();
  }

  private handleLoadPersonal(): void {
    this.loadSubject$
      .pipe(
        filter(() => this.personal),
        mergeMap((x) => {
          return this.scheduleService.getPersonalChangeScheduleRequests(x).pipe(
            tap((changeSchedules) => {
              this.store.dispatch(
                ApiAction.loadSuccessful({
                  changeSchedulesResponse: changeSchedules,
                })
              );
            }),
            catchError(() => of(this.store.dispatch(ApiAction.loadFailure())))
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
        map(([department, params]) => ({
          department: department.id,
          params,
        })),
        mergeMap(({ department, params }) => {
          return this.scheduleService
            .getDepartmentChangeScheduleRequests(department, params)
            .pipe(
              tap((changeSchedules) => {
                this.store.dispatch(
                  ApiAction.loadSuccessful({
                    changeSchedulesResponse: changeSchedules,
                  })
                );
              }),
              catchError(() => of(this.store.dispatch(ApiAction.loadFailure())))
            );
        })
      )
      .subscribe();
  }

  private handleLoadManager(): void {
    this.loadSubject$
      .pipe(
        filter(() => !this.personal),
        mergeMap((x) => {
          return this.scheduleService.getManagerChangeScheduleRequests(x).pipe(
            tap((changeSchedules) => {
              this.store.dispatch(
                ApiAction.loadSuccessful({
                  changeSchedulesResponse: changeSchedules,
                })
              );
            }),
            catchError(() => of(this.store.dispatch(ApiAction.loadFailure())))
          );
        })
      )
      .subscribe();
  }
}
