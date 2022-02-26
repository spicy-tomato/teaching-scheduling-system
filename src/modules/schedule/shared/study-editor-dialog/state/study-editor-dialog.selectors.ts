import { createFeatureSelector, createSelector } from '@ngrx/store';
import { studyEditorDialogFeatureKey, StudyEditorDialogState } from '.';

const studyEditorDialogSelector = createFeatureSelector<StudyEditorDialogState>(
  studyEditorDialogFeatureKey
);

export const selectRequestStatus = createSelector(
  studyEditorDialogSelector,
  (state) => state.requestStatus
);

export const selectUpdateStatus = createSelector(
  studyEditorDialogSelector,
  (state) => state.updateStatus
);

export const selectSearchStatus = createSelector(
  studyEditorDialogSelector,
  (state) => state.searchStatus
);

export const selectCancelStatus = createSelector(
  studyEditorDialogSelector,
  (state) => state.cancelStatus
);

export const selectRequestingChangeSchedule = createSelector(
  studyEditorDialogSelector,
  (state) => state.requestingChangeSchedule
);

export const selectJustRequestedSchedule = createSelector(
  studyEditorDialogSelector,
  (state) => state.justRequestedSchedule
);

export const selectChange = createSelector(
  studyEditorDialogSelector,
  (state) => state.change
);

export const selectSearchSchedule = createSelector(
  studyEditorDialogSelector,
  (state) => state.searchSchedule
);
