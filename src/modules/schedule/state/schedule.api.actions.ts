import { createAction, props } from '@ngrx/store';
import { StudyScheduleModel, ExamScheduleModel } from 'src/shared/models';

export const loadPersonalStudySuccessful = createAction(
  '[Schedule API] Load personal study Successfully',
  props<{ schedules: StudyScheduleModel[] }>()
);

export const loadPersonalStudyFailure = createAction(
  '[Schedule API] Load personal study Failed'
);

export const loadPersonalExamSuccessful = createAction(
  '[Schedule API] Load Exam Successfully',
  props<{ schedules: ExamScheduleModel[] }>()
);

export const loadPersonalExamFailure = createAction(
  '[Schedule API] Load Exam Failed'
);

export const loadDepartmentStudySuccessful = createAction(
  '[Schedule API] Load department study Successfully',
  props<{ schedules: StudyScheduleModel[] }>()
);

export const loadDepartmentStudyFailure = createAction(
  '[Schedule API] Load department study Failed'
);

export const loadDepartmentExamSuccessful = createAction(
  '[Schedule API] Load department exam Successfully',
  props<{ schedules: ExamScheduleModel[] }>()
);

export const loadDepartmentExamFailure = createAction(
  '[Schedule API] Load department exam Failed'
);

export const unauthorized = createAction('[Schedule API] Unauthorized');
