import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './assign-schedule.page.actions';
import * as ApiAction from './assign-schedule.api.actions';
import { CommonInfoService } from '@services/common-info.service';
import { LocalStorageService } from '@services/core/storage/local-storage.service';
import { LocalStorageKeyConstant } from '@constants/core/local-storage-key.constant';
import { StorageTimeoutModel } from '@models/core/storage-timeout.model';
import { AcademicYear } from '@models/core/academic-year.model';

@Injectable()
export class AssignScheduleEffects {
  /** EFFECTS */
  public loadSchoolYear$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.loadSchoolYear),
      mergeMap(() => {
        const cache = this.localStorageService.getItemWithType<
          StorageTimeoutModel<string[]>
        >(LocalStorageKeyConstant.SCHOOL_YEAR);

        if (cache && cache.isValid()) {
          return of(
            ApiAction.loadSchoolYearSuccessful({
              schoolYears: cache.data,
            })
          );
        }

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
        const json = this.localStorageService.getItemWithType<
          StorageTimeoutModel<AcademicYear>
        >(LocalStorageKeyConstant.ACADEMIC_YEAR);
        
        if (json) {
          const cache = StorageTimeoutModel.fromObject(json);
          if (cache.isValid()) {
            return of(
              ApiAction.loadAcademicYearSuccessful({
                academicYears: cache.data,
              })
            );
          }
        }

        return this.commonInfoService.getAcademicYear().pipe(
          map((academicYears) => {
            this.localStorageService.setItem(
              LocalStorageKeyConstant.ACADEMIC_YEAR,
              JSON.stringify(new StorageTimeoutModel(academicYears))
            );
            return ApiAction.loadAcademicYearSuccessful({ academicYears });
          }),
          catchError(() => of(ApiAction.loadAcademicYearFailure()))
        );
      })
    );
  });

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly commonInfoService: CommonInfoService,
    private readonly localStorageService: LocalStorageService
  ) {}
}
