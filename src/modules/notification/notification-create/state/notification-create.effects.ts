import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './notification-create.page.actions';
import * as ApiAction from './notification-create.api.actions';
import { catchError, debounceTime, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { isEmpty } from 'lodash';
import { NotificationService } from '@services/notification.service';
import { CommonInfoService } from '@services/common-info.service';
import { SessionStorageService } from '@services/storage/session-storage.service';
import { SessionStorageKeyConstant } from '@constants/session-storage-key.constants';
import { AcademicYear } from '@models/core/academic-year.model';

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
      ofType(PageAction.loadManagingClass),
      mergeMap(() => {
        const cacheData = this.sessionStorageService.getItem(SessionStorageKeyConstant.academicYears);
        if (cacheData) {
          return of(
            ApiAction.loadAcademicYearsSuccessful({ academicYears: JSON.parse(cacheData) as AcademicYear[] })
          );
        }

        return this.commonInfoService.getAcademicYear().pipe(
          map((academicYears) => {
            this.sessionStorageService.setItem(SessionStorageKeyConstant.academicYears, JSON.stringify(academicYears));
            return ApiAction.loadAcademicYearsSuccessful({ academicYears });
          }),
          catchError(() => of(ApiAction.loadAcademicYearsFailure()))
        );
      }
      )
    );
  });

  public loadFaculties$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.loadManagingClass),
      mergeMap(() => {
        const cacheData = this.sessionStorageService.getItem(SessionStorageKeyConstant.faculties);
        if (cacheData) {
          return of(
            ApiAction.loadFacultiesSuccessful({ faculties: JSON.parse(cacheData) as AcademicYear[] })
          );
        }

        return this.commonInfoService.getFaculty().pipe(
          map((faculties) => {
            this.sessionStorageService.setItem(SessionStorageKeyConstant.faculties, JSON.stringify(faculties));
            return ApiAction.loadFacultiesSuccessful({ faculties });
          }),
          catchError(() => of(ApiAction.loadFacultiesFailure()))
        );
      }
      )
    );
  });

  constructor(
    private actions$: Actions,
    private sessionStorageService: SessionStorageService,
    private notificationService: NotificationService,
    private readonly commonInfoService: CommonInfoService
  ) { }
}
