import { createFeatureSelector, createSelector } from '@ngrx/store';
import { teachingScheduleRequestFeatureKey } from './requests.reducer';
import { TeachingScheduleRequestState } from './requests.state';

const teachingScheduleRequestSelector =
  createFeatureSelector<TeachingScheduleRequestState>(
    teachingScheduleRequestFeatureKey
  );

export const teachingScheduleRequestSelectStatus = createSelector(
  teachingScheduleRequestSelector,
  (state) => state.status
);

export const teachingScheduleRequestSelectOptions = createSelector(
  teachingScheduleRequestSelector,
  (state) => state.options
);

export const teachingScheduleRequestSelectChangeSchedules = createSelector(
  teachingScheduleRequestSelector,
  (state) => state.changeSchedules
);

export const teachingScheduleRequestSelectQuery = createSelector(
  teachingScheduleRequestSelector,
  (state) => state.query
);

export const teachingScheduleRequestSelectPage = createSelector(
  teachingScheduleRequestSelectQuery,
  (query) => query.page
);

export const teachingScheduleRequestSelectRequestQueue = createSelector(
  teachingScheduleRequestSelector,
  (state) => state.status.queue
);

export const teachingScheduleRequestSelectPageCount = createSelector(
  teachingScheduleRequestSelector,
  (state) => state.total
);

const teachingScheduleRequestSelectExportIndexes = createSelector(
  teachingScheduleRequestSelector,
  (state) => state.exportIndexes
);

export const teachingScheduleRequestSelectExportSchedule = createSelector(
  teachingScheduleRequestSelectChangeSchedules,
  teachingScheduleRequestSelectExportIndexes,
  (changeSchedules, indexes) =>
    changeSchedules.filter((_, index) => indexes[index])
);
