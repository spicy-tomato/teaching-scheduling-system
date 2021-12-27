import { ExamScheduleModel } from '@models/schedule/exam-schedule.model';
import { StudyScheduleModel } from '@models/schedule/study-schedule.model';
import { createAction, props } from '@ngrx/store';

export const loadStudySuccessful = createAction(
  '[Schedule API] Load Study Successfully',
  props<{ schedules: StudyScheduleModel[] }>()
);

export const loadStudyFailure = createAction(
  '[Schedule API] Load Study Failed'
);

export const loadExamSuccessful = createAction(
  '[Schedule API] Load Exam Successfully',
  props<{ schedules: ExamScheduleModel[] }>()
);

export const loadExamFailure = createAction('[Schedule API] Load Exam Failed');
