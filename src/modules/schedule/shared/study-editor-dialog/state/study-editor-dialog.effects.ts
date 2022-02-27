import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './study-editor-dialog.page.actions';
import * as ApiAction from './study-editor-dialog.api.actions';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { ScheduleService } from '@services/schedule.service';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@modules/core/base/base.component';
import { ObservableHelper } from '@shared/helpers';

@Injectable()
export class StudyEditorDialogEffects extends BaseComponent {
  /** PRIVATE PROPERTIES */
  private readonly teacher$ = this.appShellStore
    .select(fromAppShell.selectTeacher)
    .pipe(takeUntil(this.destroy$));

  /** EFFECTS */
  public request$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.request),
      mergeMap(({ body }) => {
        return this.scheduleService.requestChangeSchedule(body).pipe(
          map((response) => {
            const { newDate, newShift, newIdRoom } = body;
            return ApiAction.requestSuccessful({
              justRequestedSchedule: {
                id: response.data,
                newDate,
                newShift,
                newIdRoom,
                status: 0,
                timeRequest: new Date(),
              },
            });
          }),
          catchError(() => of(ApiAction.requestFailure()))
        );
      })
    );
  });

  public update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.update),
      mergeMap(({ body }) => {
        return this.scheduleService.updateStudyNote(body).pipe(
          map(() => {
            const { note } = body;
            return ApiAction.updateSuccessful({
              change: { note },
            });
          }),
          catchError(() => of(ApiAction.updateFailure()))
        );
      })
    );
  });

  public search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.search),
      withLatestFrom(
        this.teacher$.pipe(
          ObservableHelper.filterNullish(),
          map((x) => x.id)
        )
      ),
      mergeMap(([{ params }, teacherId]) => {
        return this.scheduleService.getSchedule(params, teacherId).pipe(
          map((searchSchedule) =>
            ApiAction.searchSuccessful({ searchSchedule })
          ),
          catchError(() => of(ApiAction.searchFailure()))
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
            map(() => ApiAction.cancelSuccessful()),
            catchError(() => of(ApiAction.cancelFailure()))
          );
      })
    );
  });

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly scheduleService: ScheduleService,
    private readonly appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();
  }
}
