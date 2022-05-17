import { createFeatureSelector, createSelector } from '@ngrx/store';
import { requestsFeatureKey, RequestsState } from '.';

const feedbackSelector =
  createFeatureSelector<RequestsState>(requestsFeatureKey);

export const selectStatus = createSelector(
  feedbackSelector,
  (state) => state.status
);

export const selectOptions = createSelector(
  feedbackSelector,
  (state) => state.options
);

export const selectChangeSchedules = createSelector(
  feedbackSelector,
  (state) => state.changeSchedules
);

export const selectTeachers = createSelector(
  feedbackSelector,
  (state) => state.teachers
);

export const selectQuery = createSelector(
  feedbackSelector,
  (state) => state.query
);

export const selectPage = createSelector(selectQuery, (query) => query.page);

export const selectRequestQueue = createSelector(
  feedbackSelector,
  (state) => state.status.queue
);

export const selectPageCount = createSelector(
  feedbackSelector,
  (state) => state.total
);

const selectExportIndexes = createSelector(
  feedbackSelector,
  (state) => state.exportIndexes
);

export const selectExportSchedule = createSelector(
  selectChangeSchedules,
  selectExportIndexes,
  (changeSchedules, indexes) =>
    changeSchedules.filter((_, index) => indexes[index])
);
