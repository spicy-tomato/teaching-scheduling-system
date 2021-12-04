import { ScheduleModel } from '@models/schedule/schedule.model';
import { createAction, props } from '@ngrx/store';

export const loadSuccessful = createAction(
  '[Schedule API] Load Successfully',
  props<{ schedules: ScheduleModel[] }>()
);

export const loadFailure = createAction('[Schedule API] Load Failed');
