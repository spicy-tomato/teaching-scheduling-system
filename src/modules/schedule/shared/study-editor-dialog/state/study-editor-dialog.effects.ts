import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './study-editor-dialog.page.actions';
import * as ApiAction from './study-editor-dialog.api.actions';
import { ScheduleService } from '@services/schedule.service';
import { BaseComponent } from '@modules/core/base/base.component';

@Injectable()
export class StudyEditorDialogEffects extends BaseComponent {
  /** EFFECTS */
  public request$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.request),
      mergeMap(({ body }) => {
        return this.scheduleService.requestChangeSchedule(body).pipe(
          map(() => {
            const { newDate, newShift, newIdRoom } = body;
            return ApiAction.requestSuccessful({
              justRequestedSchedule: {
                newDate,
                newShift,
                newIdRoom,
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

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly scheduleService: ScheduleService
  ) {
    super();
  }
}
