import { createFeatureSelector, createSelector } from "@ngrx/store";
import { notificationCreateFeatureKey, NotificationCreateState } from ".";

const notificationCreateSelector = createFeatureSelector<NotificationCreateState>(notificationCreateFeatureKey);

export const selectErrors = createSelector(
  notificationCreateSelector,
  (state) => state.errors
)

