import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import {
  ClassService,
  CommonInfoService,
  TeacherService,
} from '@teaching-scheduling-system/web/shared/data-access/services';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import * as ApiAction from './assign-schedule.api.actions';
import * as PageAction from './assign-schedule.page.actions';
import {
  teachingScheduleAssign_SelectSelectedAssigned,
  teachingScheduleAssign_SelectSelectedNeedAssign,
  teachingScheduleAssign_SelectSelectedTeacher,
} from './assign-schedule.selectors';
import { TeachingScheduleAssignState } from './assign-schedule.state';

@Injectable()
export class TeachingScheduleAssignEffects {
  // PRIVATE PROPERTIES 
  private selectingTeacher$ = this.store.select(
    teachingScheduleAssign_SelectSelectedTeacher
  );
  private selectingNeedAssign$ = this.store.select(
    teachingScheduleAssign_SelectSelectedNeedAssign
  );
  private selectingAssigned$ = this.store.select(
    teachingScheduleAssign_SelectSelectedAssigned
  );

  // EFFECTS 
  loadDepartment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingScheduleAssign_LoadFilter),
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

  filter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingScheduleAssign_Filter),
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

  loadTeacher$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingScheduleAssign_Filter),
      mergeMap(({ dep }) => {
        return this.teacherService.getByDepartment(dep).pipe(
          map((r) => r.data),
          map((teachers) => ApiAction.loadTeacherSuccessful({ teachers })),
          catchError(() => of(ApiAction.loadTeacherFailure()))
        );
      })
    );
  });

  assign$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingScheduleAssign_Assign),
      withLatestFrom(
        this.selectingTeacher$.pipe(ObservableHelper.filterNullish()),
        this.selectingNeedAssign$.pipe(map((s) => s.map((x) => x.id)))
      ),
      mergeMap(({ 1: teacher, 2: classIds }) => {
        return this.classService.assign(teacher.id, classIds).pipe(
          map(() => ApiAction.assignSuccessful({ teacher, classIds })),
          catchError(() => of(ApiAction.assignFailure()))
        );
      })
    );
  });

  unassign$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingScheduleAssign_Unassign),
      withLatestFrom(
        this.selectingAssigned$.pipe(map((s) => s.map((x) => x.id)))
      ),
      mergeMap(({ 1: classIds }) => {
        return this.classService.unassign(classIds).pipe(
          map(() => ApiAction.unassignSuccessful({ classIds })),
          catchError(() => of(ApiAction.unassignFailure()))
        );
      })
    );
  });

  // CONSTRUCTOR 
  constructor(
    private readonly actions$: Actions,
    private readonly commonInfoService: CommonInfoService,
    private readonly classService: ClassService,
    private readonly teacherService: TeacherService,
    private readonly store: Store<TeachingScheduleAssignState>
  ) {}
}
