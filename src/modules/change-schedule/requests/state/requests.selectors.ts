import { createFeatureSelector, createSelector } from '@ngrx/store';
import { requestsFeatureKey, RequestsState } from '.';

const feedbackSelector =
  createFeatureSelector<RequestsState>(requestsFeatureKey);

export const selectStatus = createSelector(
  feedbackSelector,
  (state) => state.status
);

export const selectChangeSchedules = createSelector(
  feedbackSelector,
  (state) => state.changeSchedules
);

export const selectQuery = createSelector(
  feedbackSelector,
  (state) => state.query
);
