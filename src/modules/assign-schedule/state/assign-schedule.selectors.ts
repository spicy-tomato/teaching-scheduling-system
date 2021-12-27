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

export const selectDepartments = createSelector(
  assignScheduleSelector,
  (state) => state.departments
);

export const selectNeedAssign = createSelector(
  assignScheduleSelector,
  (state) => state.needAssign.data
);

export const selectSelectedNeedAssign = createSelector(
  assignScheduleSelector,
  (state) => state.needAssign.selected
);

export const selectAssigned = createSelector(
  assignScheduleSelector,
  (state) => state.assigned.data
);

export const selectSelectedAssigned = createSelector(
  assignScheduleSelector,
  (state) => state.assigned.selected
);

export const selectStatus = createSelector(
  assignScheduleSelector,
  (state) => state.status
);

export const selectTeachers = createSelector(
  assignScheduleSelector,
  (state) => state.teacher.data
);

// export const selectAssignedSuccessful = createSelector(
//   assignScheduleSelector,
//   (state) => state.assignedSuccessful
// );
