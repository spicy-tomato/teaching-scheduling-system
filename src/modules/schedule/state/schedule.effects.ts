import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './schedule.page.actions';
import * as ApiAction from './schedule.api.actions';
import { ScheduleService } from '@services/schedule.service';

@Injectable()
export class ScheduleEffects {
  /** EFFECTS */
  public load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.load),
      mergeMap(() => {
        return this.scheduleService.getExamSchedule().pipe(
          map((schedules) => {
            return ApiAction.loadSuccessful({ schedules });
          }),
          catchError(() => of(ApiAction.loadFailure()))
        );
      })
    );
  });

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly scheduleService: ScheduleService
  ) {}
}
