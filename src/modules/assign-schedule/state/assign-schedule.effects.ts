import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './assign-schedule.page.actions';
import * as ApiAction from './assign-schedule.api.actions';
import { CommonInfoService } from '@services/common-info.service';

@Injectable()
export class AssignScheduleEffects {
  /** EFFECTS */
  public loadSchoolYear$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.loadSchoolYear),
      mergeMap(() => {
        return this.commonInfoService.getSchoolYear().pipe(
          map((schoolYears) =>
            ApiAction.loadSchoolYearSuccessful({ schoolYears })
          ),
          catchError(() => of(ApiAction.loadSchoolYearFailure()))
        );
      })
    );
  });

  public loadAcademicYear$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.loadAcademicYear),
      mergeMap(() => {
        return this.commonInfoService.getAcademicYear().pipe(
          map((academicYears) =>
            ApiAction.loadAcademicYearSuccessful({ academicYears })
          ),
          catchError(() => of(ApiAction.loadAcademicYearFailure()))
        );
      })
    );
  });

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly commonInfoService: CommonInfoService
  ) {}
}
