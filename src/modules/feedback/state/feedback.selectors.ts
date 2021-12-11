import { createFeatureSelector, createSelector } from '@ngrx/store';
import { feedbackFeatureKey, FeedbackState } from '.';

const feedbackSelector =
  createFeatureSelector<FeedbackState>(feedbackFeatureKey);

export const selectStatus = createSelector(
  feedbackSelector,
  (state) => state.status
);
