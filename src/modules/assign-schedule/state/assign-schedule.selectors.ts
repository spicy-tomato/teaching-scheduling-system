import { createFeatureSelector, createSelector } from '@ngrx/store';
import { assignScheduleFeatureKey, AssignScheduleState } from '.';

const assignScheduleSelector = createFeatureSelector<AssignScheduleState>(
  assignScheduleFeatureKey
);

export const selectSchoolYear = createSelector(
  assignScheduleSelector,
  (state) => state.currentTerm
);

export const selectAcademicYear = createSelector(
  assignScheduleSelector,
  (state) => state.academicYears
);

export const selectTrainingType = createSelector(
  selectAcademicYear,
  (academicYears) => Object.keys(academicYears)
);
