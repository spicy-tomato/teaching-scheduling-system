import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  take,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './requests.page.actions';
import * as ApiAction from './requests.api.actions';
import * as fromRequests from '.';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { ScheduleService } from '@services/schedule.service';
import { BaseComponent } from '@modules/core/base/base.component';
import { ChangeScheduleOptions } from '@shared/models';
import { Store } from '@ngrx/store';
import { DateHelper } from '@shared/helpers';

@Injectable()
export class RequestsEffects extends BaseComponent {
  /** PRIVATE PROPERTIES */
  private options$: Observable<ChangeScheduleOptions>;
  private nameTitle$: Observable<string> = this.appShellStore
    .select(fromAppShell.selectNameTitle)
    .pipe(takeUntil(this.destroy$));
    
  /** EFFECTS */
  public load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.load),
      mergeMap(({ query: params }) => {
        return this.scheduleService.getChangeScheduleRequests(params).pipe(
          map((changeSchedules) =>
            ApiAction.loadSuccessful({
              changeSchedulesResponse: changeSchedules,
            })
          ),
          catchError(() => of(ApiAction.loadFailure()))
        );
      })
    );
  });

  public changeSelectedStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.changeOptions),
      map((x) => x.options.selectedStatus),
      filter((x) => x !== undefined),
      mergeMap((status) => {
        console.log('load 1');
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
        console.log('load 2');
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
    private readonly appShellStore: Store<fromAppShell.AppShellState>,
    store: Store<fromRequests.RequestsState>
  ) {
    super();

    this.options$ = store
      .select(fromRequests.selectOptions)
      .pipe(takeUntil(this.destroy$));
  }
}
