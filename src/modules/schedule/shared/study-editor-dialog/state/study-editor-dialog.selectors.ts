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
