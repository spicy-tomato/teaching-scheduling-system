import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './requests.page.actions';
import * as ApiAction from './requests.api.actions';
import { ScheduleService } from '@services/schedule.service';

@Injectable()
export class RequestsEffects {
  /** EFFECTS */
  public submit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.load),
      mergeMap(({ query: params }) => {
        return this.scheduleService.getChangeScheduleRequests(params).pipe(
          map((changeSchedules) =>
            ApiAction.loadSuccessful({ changeSchedulesResponse: changeSchedules })
          ),
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
