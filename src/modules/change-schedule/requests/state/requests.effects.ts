import { Injectable, OnDestroy } from '@angular/core';
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
import { ChangeScheduleOptions, ChangeScheduleSearch } from '@shared/models';
import { Store } from '@ngrx/store';
import { DateHelper, ObservableHelper } from '@shared/helpers';

@Injectable()
export class RequestsEffects extends BaseComponent implements OnDestroy {
  /** PRIVATE PROPERTIES */
  private personal!: boolean;
  private readonly options$: Observable<ChangeScheduleOptions>;
  private readonly department$: Observable<string | undefined>;
  private readonly loadSubject$ = new Subject<ChangeScheduleSearch>();
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
      filter((x) => x !== undefined),
      mergeMap((status) => {
        return of(
          PageAction.load({
            query: {
              status: status ?? 'all',
              page: 1,
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
          map((options) =>
            PageAction.load({
              query: {
                status: options.selectedStatus ?? 'all',
                page: page + 1,
              },
            })
          ),
          take(1)
        );
      })
    );
  });

  public accept$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.accept),
      withLatestFrom(this.nameTitle$),
      mergeMap(([{ id }, nameTitle]) => {
        return this.scheduleService
          .responseChangeScheduleRequests({
            id,
            status: 1,
            timeAccept: DateHelper.toSqlDate(new Date()),
            comment: `Trưởng bộ môn đã phê duyệt yêu cầu thay đổi của ${nameTitle.toLocaleLowerCase()}`,
          })
          .pipe(
            map(() => ApiAction.acceptSuccessful({ id })),
            catchError(() => of(ApiAction.acceptFailure()))
          );
      })
    );
  });

  public deny$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.deny),
      withLatestFrom(this.nameTitle$),
      mergeMap(([{ id, reason }, nameTitle]) => {
        return this.scheduleService
          .responseChangeScheduleRequests({
            id,
            status: -1,
            timeAccept: DateHelper.toSqlDate(new Date()),
            comment: `Trưởng bộ môn đã từ chối yêu cầu thay đổi của ${nameTitle.toLocaleLowerCase()} với lý do: ${reason}`,
          })
          .pipe(
            map(() => ApiAction.denySuccessful({ id })),
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

    this.options$ = store
      .select(fromRequests.selectOptions)
      .pipe(takeUntil(this.destroy$));
    this.department$ = appShellStore
      .select(fromAppShell.selectDepartment)
      .pipe(takeUntil(this.destroy$));
    this.nameTitle$ = appShellStore
      .select(fromAppShell.selectNameTitle)
      .pipe(takeUntil(this.destroy$));

    this.handleLoadPersonal();
    this.handleLoadDepartment();
  }

  /** LIFE CYCLES */
  public ngOnDestroy(): void {
    this.loadSubject$.complete();
    super.ngOnDestroy();
  }

  /** PRIVATE METHODS */
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
}
