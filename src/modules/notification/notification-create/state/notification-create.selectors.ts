import { createFeatureSelector, createSelector } from "@ngrx/store";
import { notificationCreateFeatureKey, NotificationCreateState } from ".";

const notificationCreateSelector = createFeatureSelector<NotificationCreateState>(notificationCreateFeatureKey);

export const selectErrors = createSelector(
  notificationCreateSelector,
  (state) => state.errors
)

export const selectStatus = createSelector(
  notificationCreateSelector,
  (state) => state.status
)

export const selectAcademicYears = createSelector(
  notificationCreateSelector,
  (state) => state.managingData.academicYears
)

export const selectFaculties = createSelector(
  notificationCreateSelector,
  (state) => state.managingData.faculties
)
