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

export const selectFilterStatus = createSelector(
  assignScheduleSelector,
  (state) => state.status.filter
);

export const selectAssignStatus = createSelector(
  assignScheduleSelector,
  (state) => state.status.assign
);

export const selectUnassignStatus = createSelector(
  assignScheduleSelector,
  (state) => state.status.unassign
);

const _selectTeacher = createSelector(
  assignScheduleSelector,
  (state) => state.teacher
);

export const selectTeachers = createSelector(
  _selectTeacher,
  (teacher) => teacher.data
);

export const selectSelectedTeacher = createSelector(
  _selectTeacher,
  (teacher) => teacher.selected
);

export const selectActionTeacher = createSelector(
  _selectTeacher,
  (teacher) => teacher.action
);

export const selectActionCountTeacher = createSelector(
  _selectTeacher,
  (teacher) => teacher.actionCount
);
