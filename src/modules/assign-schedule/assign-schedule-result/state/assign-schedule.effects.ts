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
  public loadDepartment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.loadFilter),
      mergeMap(() => {
        return this.commonInfoService.getFaculties().pipe(
          map((response) => {
            return ApiAction.loadDepartmentSuccessful({ departments: response.data });
          }),
          catchError(() => of(ApiAction.loadTeacherFailure()))
        );
      })
    );
  });

  public filter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.filter),
      mergeMap(({ dep, params }) => {
        return this.classService.getDepartmentModuleClass(dep, params).pipe(
          map((response) => {
            return ApiAction.filterSuccessful({ classes: response.data });
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

  public assign$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.assign),
      mergeMap(({ teacher, classIds }) => {
        return this.classService.assign(teacher.id, classIds).pipe(
          map(() => {
            return ApiAction.assignSuccessful({ teacher });
          }),
          catchError(() => of(ApiAction.assignFailure()))
        );
      })
    );
  });

  public unassign$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.unassign),
      mergeMap(({ classIds }) => {
        return this.classService.unassign(classIds).pipe(
          map(() => {
            return ApiAction.unassignSuccessful();
          }),
          catchError(() => of(ApiAction.unassignFailure()))
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
