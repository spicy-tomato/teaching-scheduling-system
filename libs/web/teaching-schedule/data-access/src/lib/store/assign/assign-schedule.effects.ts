import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  ClassService,
  CommonInfoService,
  TeacherService,
} from '@teaching-scheduling-system/web/shared/data-access/services';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as ApiAction from './assign-schedule.api.actions';
import * as PageAction from './assign-schedule.page.actions';

@Injectable()
export class TeachingScheduleAssignEffects {
  /** EFFECTS */
  public loadDepartment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingScheduleAssignLoadFilter),
      mergeMap(() => {
        return this.commonInfoService.getFaculties().pipe(
          map((response) =>
            ApiAction.loadDepartmentSuccessful({
              departments: response.data,
            })
          ),
          catchError(() => of(ApiAction.loadTeacherFailure()))
        );
      })
    );
  });

  public filter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingScheduleAssignFilter),
      mergeMap(({ dep, params }) => {
        return this.classService.getDepartmentModuleClass(dep, params).pipe(
          map((response) =>
            ApiAction.filterSuccessful({ classes: response.data })
          ),
          catchError(() => of(ApiAction.filterFailure()))
        );
      })
    );
  });

  public loadTeacher$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingScheduleAssignFilter),
      mergeMap(({ dep }) => {
        return this.teacherService.getByDepartment(dep).pipe(
          map((r) => r.data),
          map((teachers) => ApiAction.loadTeacherSuccessful({ teachers })),
          catchError(() => of(ApiAction.loadTeacherFailure()))
        );
      })
    );
  });

  public assign$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingScheduleAssignAssign),
      mergeMap(({ teacher, classIds }) => {
        return this.classService.assign(teacher.id, classIds).pipe(
          map(() => ApiAction.assignSuccessful({ teacher })),
          catchError(() => of(ApiAction.assignFailure()))
        );
      })
    );
  });

  public unassign$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingScheduleAssignUnassign),
      mergeMap(({ classIds }) => {
        return this.classService.unassign(classIds).pipe(
          map(() => ApiAction.unassignSuccessful()),
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
