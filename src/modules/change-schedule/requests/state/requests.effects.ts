import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './requests.page.actions';
import * as ApiAction from './requests.api.actions';
import * as fromRequests from '.';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { ScheduleService } from '@services/schedule.service';
import { BaseComponent } from '@modules/core/base/base.component';
import {
  ChangeScheduleOptions,
  ChangeScheduleSearch,
  Nullable,
} from '@shared/models';
import { Store } from '@ngrx/store';
import { DateHelper, ObservableHelper } from '@shared/helpers';
import { PermissionConstant } from '@shared/constants';

@Injectable()
export class RequestsEffects extends BaseComponent {
  /** PRIVATE PROPERTIES */
  private personal!: boolean;
  private readonly options$: Observable<ChangeScheduleOptions>;
  private readonly department$: Observable<Nullable<string>>;
  private readonly loadSubject$ = new Subject<ChangeScheduleSearch>();
  private readonly permissions$ = this.appShellStore
    .select(fromAppShell.selectPermission)
    .pipe(takeUntil(this.destroy$));
  private readonly nameTitle$ = this.appShellStore
    .select(fromAppShell.selectNameTitle)
    .pipe(takeUntil(this.destroy$));

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
      withLatestFrom(this.nameTitle$, this.permissions$),
      mergeMap(([{ schedule }, nameTitle, permissions]) => {
        const { id, idSchedule } = schedule;
        const status =
          permissions.includes(
            PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE
          ) && !schedule.newSchedule.room
            ? 1
            : 2;
        const time = DateHelper.toSqlDate(new Date());
        const comment = `Trưởng bộ môn đã phê duyệt yêu cầu thay đổi của ${nameTitle.toLocaleLowerCase()}`;

        return this.scheduleService
          .responseChangeScheduleRequests({
            id,
            idSchedule,
            status,
            time,
            comment,
          })
          .pipe(
            map(() => ApiAction.acceptSuccessful({ id, status })),
            catchError(() => of(ApiAction.acceptFailure()))
          );
      })
    );
  });

  public deny$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.deny),
      withLatestFrom(this.nameTitle$, this.permissions$),
      mergeMap(([{ schedule, reason }, nameTitle, permissions]) => {
        const { id, idSchedule } = schedule;
        const status = permissions.includes(
          PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE
        )
          ? -1
          : -2;
        const time = DateHelper.toSqlDate(new Date());
        const comment = `Trưởng bộ môn đã từ chối yêu cầu thay đổi của ${nameTitle.toLocaleLowerCase()} với lý do: ${reason}`;

        return this.scheduleService
          .responseChangeScheduleRequests({
            id,
            idSchedule,
            status,
            time,
            comment,
          })
          .pipe(
            map(() => ApiAction.denySuccessful({ id, status })),
            catchError(() => of(ApiAction.denyFailure()))
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
    super();

    this.assignSubjects([this.loadSubject$]);

    this.options$ = store
      .select(fromRequests.selectOptions)
      .pipe(takeUntil(this.destroy$));
    this.department$ = appShellStore
      .select(fromAppShell.selectDepartment)
      .pipe(takeUntil(this.destroy$));
    this.nameTitle$ = appShellStore
      .select(fromAppShell.selectNameTitle)
      .pipe(takeUntil(this.destroy$));

    this.handlePermissionChange();
  }

  /** PRIVATE METHODS */
  private handlePermissionChange(): void {
    this.permissions$
      .pipe(
        filter((permissions) => permissions.length > 0),
        tap((permissions) => {
          if (
            permissions.includes(
              PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE
            )
          ) {
            this.handleLoadPersonal();
          }
          if (
            permissions.includes(PermissionConstant.SEE_DEPARTMENT_SCHEDULE)
          ) {
            this.handleLoadDepartment();
          }
          if (permissions.includes(PermissionConstant.MANAGE_ROOM)) {
            this.handleLoadManager();
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
        }),
        takeUntil(this.destroy$)
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
        mergeMap((x) => {
          return this.scheduleService
            .getDepartmentChangeScheduleRequests(...x)
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
        }),
        takeUntil(this.destroy$)
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
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
