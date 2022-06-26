import { createFeatureSelector, createSelector } from '@ngrx/store';
import { teachingDialogFeatureKey, TeachingDialogState } from '.';

const studyEditorDialogSelector = createFeatureSelector<TeachingDialogState>(
  teachingDialogFeatureKey
);

export const teachingDialogSelectChangeStatus = createSelector(
  studyEditorDialogSelector,
  (state) => state.changeStatus
);

export const teachingDialogSelectRequestStatus = createSelector(
  studyEditorDialogSelector,
  (state) => state.requestStatus
);

export const teachingDialogSelectUpdateStatus = createSelector(
  studyEditorDialogSelector,
  (state) => state.updateStatus
);

export const teachingDialogSelectSearchStatus = createSelector(
  studyEditorDialogSelector,
  (state) => state.searchStatus
);

export const teachingDialogSelectCancelStatus = createSelector(
  studyEditorDialogSelector,
  (state) => state.cancelStatus
);

export const teachingDialogSelectRequestingChangeSchedule = createSelector(
  studyEditorDialogSelector,
  (state) => state.requestingChangeSchedule
);

export const teachingDialogSelectJustRequestedSchedule = createSelector(
  studyEditorDialogSelector,
  (state) => state.justRequestedSchedule
);

export const teachingDialogSelectChange = createSelector(
  studyEditorDialogSelector,
  (state) => state.change
);

export const teachingDialogSelectSearchSchedule = createSelector(
  studyEditorDialogSelector,
  (state) => state.searchSchedule
);
