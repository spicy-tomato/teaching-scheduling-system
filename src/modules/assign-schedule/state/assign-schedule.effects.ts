import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './assign-schedule.page.actions';
import * as ApiAction from './assign-schedule.api.actions';
import { CommonInfoService } from '@services/common-info.service';
import { ClassService } from '@services/class.service';
import { TeacherService } from '@services/teacher.service';

@Injectable()
export class AssignScheduleEffects {
  /** EFFECTS */
  public loadSchoolYear$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.loadSchoolYear),
      mergeMap(() => {
        return this.commonInfoService
          .getCurrentTerm()
          .pipe(
            map((currentTerm) =>
              ApiAction.loadCurrentTermSuccessful({ currentTerm })
            )
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

  public filter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.filter),
      mergeMap(({ dep, params }) => {
        return this.classService.getDepartmentModuleClass(dep, params).pipe(
          map((classes) => {
            return ApiAction.filterSuccessful({ classes });
          }),
          catchError(() => of(ApiAction.filterFailure()))
        );
      })
    );
  });

  public loadTeacher$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.filter),
      mergeMap(({ dep }) => {
        return this.teacherService.getByDepartment(dep).pipe(
          map((teachers) => {
            return ApiAction.loadTeacherSuccessful({ teachers });
          }),
          catchError(() => of(ApiAction.loadTeacherFailure()))
        );
      })
    );
  });

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly commonInfoService: CommonInfoService,
    private readonly classService: ClassService,
    private readonly teacherService: TeacherService
  ) {}
}
