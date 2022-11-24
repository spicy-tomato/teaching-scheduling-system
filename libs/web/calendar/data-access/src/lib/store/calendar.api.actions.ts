import { createAction, props } from '@ngrx/store';
import { TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import {
  StudyScheduleModel,
  ExamScheduleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';

export const loadPersonalStudySuccessful = createAction(
  '[Calendar API] Load personal study Successfully',
  props<{ schedules: StudyScheduleModel[]; ranges: TuiDayRange[] }>()
);

export const loadPersonalStudyFailure = createAction(
  '[Calendar API] Load personal study Failed'
);

export const loadPersonalExamSuccessful = createAction(
  '[Calendar API] Load Exam Successfully',
  props<{ schedules: ExamScheduleModel[]; ranges: TuiDayRange[] }>()
);

export const loadPersonalExamFailure = createAction(
  '[Calendar API] Load Exam Failed'
);

export const loadDepartmentStudySuccessful = createAction(
  '[Calendar API] Load department study Successfully',
  props<{ schedules: StudyScheduleModel[]; ranges: TuiDayRange[] }>()
);

export const loadDepartmentStudyFailure = createAction(
  '[Calendar API] Load department study Failed'
);

export const loadDepartmentExamSuccessful = createAction(
  '[Calendar API] Load department exam Successfully',
  props<{ schedules: ExamScheduleModel[]; ranges: TuiDayRange[] }>()
);

export const loadDepartmentExamFailure = createAction(
  '[Calendar API] Load department exam Failed'
);

export const prev = createAction(
  '[Calendar API] Prev',
  props<{ date: Date }>()
);

export const next = createAction(
  '[Calendar API] Next',
  props<{ date: Date }>()
);

export const changeMonth = createAction(
  '[Calendar API] Choose Month',
  props<{ month: TuiMonth; date: Date }>()
);
