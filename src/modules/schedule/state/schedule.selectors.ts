import { createFeatureSelector, createSelector } from '@ngrx/store';
import { scheduleFeatureKey, ScheduleState } from '.';

const scheduleSelector =
  createFeatureSelector<ScheduleState>(scheduleFeatureKey);

export const selectStudySchedule = createSelector(
  scheduleSelector,
  (state) => state.schedules.study
);

export const selectExamSchedule = createSelector(
  scheduleSelector,
  (state) => state.schedules.exam
);

export const selectSelectedDate = createSelector(
  scheduleSelector,
  (state) => state.selectedDate
);

export const selectMonth = createSelector(
  scheduleSelector,
  (state) => state.month
);

export const selectView = createSelector(
  scheduleSelector,
  (state) => state.view
);

export const selectStatus = createSelector(
  scheduleSelector,
  (state) => state.status
);

export const selectFilter = createSelector(
  scheduleSelector,
  (state) => state.filter
);
