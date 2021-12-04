import { createFeatureSelector, createSelector } from '@ngrx/store';
import { scheduleFeatureKey, ScheduleState } from '.';

const loginSelector = createFeatureSelector<ScheduleState>(scheduleFeatureKey);

export const selectSchedule = createSelector(
  loginSelector,
  (state) => state.schedules
);
