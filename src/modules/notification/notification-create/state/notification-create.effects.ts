import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './notification-create.page.actions';
import * as ApiAction from './notification-create.api.actions';
import { catchError, debounceTime, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { isEmpty } from 'lodash';
import { NotificationService } from '@services/notification.service';
import { CommonInfoService } from '@services/common-info.service';
import { SessionStorageKeyConstant } from '@constants/core/session-storage-key.constants';
import { AcademicYear } from '@models/core/academic-year.model';
import { Faculty } from '@models/core/faculty.model';
import { ClassService } from '@services/class.service';
import { LocalStorageService } from '@services/core/storage/local-storage.service';

@Injectable()
export class NotificationCreateEffects {
  public submit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.clickConfirm),
      debounceTime(300),
      mergeMap(({ value, errors }) => {
        if (!isEmpty(errors)) {
          return of(ApiAction.invalidForm({ errors }));
        }

        return this.notificationService.createModuleNotification(value).pipe(
          map(() => ApiAction.submitSuccessful()),
          catchError(() => of(ApiAction.submitFailure()))
        );
      })
    );
  });

  public loadAcademicYears$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.loadManagingClassForm),
      mergeMap(() => {
        const cacheData = this.localStorageService.getItem(
          SessionStorageKeyConstant.academicYears
        );
        if (cacheData) {
          return of(
            ApiAction.loadAcademicYearsSuccessful({
              academicYears: JSON.parse(cacheData) as AcademicYear[],
            })
          );
        }

        return this.commonInfoService.getAcademicYear().pipe(
          map((academicYears) => {
            this.localStorageService.setItem(
              SessionStorageKeyConstant.academicYears,
              JSON.stringify(academicYears)
            );
            return ApiAction.loadAcademicYearsSuccessful({ academicYears });
          }),
          catchError(() => of(ApiAction.loadAcademicYearsFailure()))
        );
      })
    );
  });

  public loadFaculties$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.loadManagingClassForm),
      mergeMap(() => {
        const cacheData = this.localStorageService.getItem(
          SessionStorageKeyConstant.faculties
        );
        if (cacheData) {
          return of(
            ApiAction.loadFacultiesSuccessful({
              faculties: JSON.parse(cacheData) as Faculty[],
            })
          );
        }

        return this.commonInfoService.getFaculty().pipe(
          map((faculties) => {
            this.localStorageService.setItem(
              SessionStorageKeyConstant.faculties,
              JSON.stringify(faculties)
            );
            return ApiAction.loadFacultiesSuccessful({ faculties });
          }),
          catchError(() => of(ApiAction.loadFacultiesFailure()))
        );
      })
    );
  });

  public loadManagingClasses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.loadManagingClasses),
      debounceTime(300),
      mergeMap((data) => {
        const params = {
          academic_year: data.academicYears.join(','),
          faculty: data.faculties.join(','),
        };

        return this.classService.getManagingClass(params).pipe(
          map((classes) => {
            return ApiAction.loadManagingClassesSuccessful({ classes });
          }),
          catchError(() => of(ApiAction.loadManagingClassesFailure()))
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly localStorageService: LocalStorageService,
    private readonly notificationService: NotificationService,
    private readonly commonInfoService: CommonInfoService,
    private readonly classService: ClassService
  ) {}
}
