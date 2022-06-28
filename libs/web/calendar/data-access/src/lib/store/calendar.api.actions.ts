import { createAction, props } from '@ngrx/store';
import { TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import {
  StudyScheduleModel,
  ExamScheduleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';

export const loadPersonalStudySuccessful = createAction(
  '[Schedule API] Load personal study Successfully',
  props<{ schedules: StudyScheduleModel[]; ranges: TuiDayRange[] }>()
);

export const loadPersonalStudyFailure = createAction(
  '[Schedule API] Load personal study Failed'
);

export const loadPersonalExamSuccessful = createAction(
  '[Schedule API] Load Exam Successfully',
  props<{ schedules: ExamScheduleModel[]; ranges: TuiDayRange[] }>()
);

export const loadPersonalExamFailure = createAction(
  '[Schedule API] Load Exam Failed'
);

export const loadDepartmentStudySuccessful = createAction(
  '[Schedule API] Load department study Successfully',
  props<{ schedules: StudyScheduleModel[]; ranges: TuiDayRange[] }>()
);

export const loadDepartmentStudyFailure = createAction(
  '[Schedule API] Load department study Failed'
);

export const loadDepartmentExamSuccessful = createAction(
  '[Schedule API] Load department exam Successfully',
  props<{ schedules: ExamScheduleModel[]; ranges: TuiDayRange[] }>()
);

export const loadDepartmentExamFailure = createAction(
  '[Schedule API] Load department exam Failed'
);

export const prev = createAction(
  '[Schedule API] Prev',
  props<{ date: Date }>()
);

export const next = createAction(
  '[Schedule API] Next',
  props<{ date: Date }>()
);

export const changeMonth = createAction(
  '[Schedule API] Choose Month',
  props<{ month: TuiMonth; date: Date }>()
);
