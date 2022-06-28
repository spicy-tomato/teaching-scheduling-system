import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  teachingScheduleAssignFeatureKey,
  TeachingScheduleAssignState,
} from '.';

const assignScheduleSelector =
  createFeatureSelector<TeachingScheduleAssignState>(
    teachingScheduleAssignFeatureKey
  );

export const teachingScheduleAssignSelectDepartments = createSelector(
  assignScheduleSelector,
  (state) => state.departments
);

export const teachingScheduleAssignSelectNeedAssign = createSelector(
  assignScheduleSelector,
  (state) => state.needAssign.data
);

export const teachingScheduleAssignSelectSelectedNeedAssign = createSelector(
  assignScheduleSelector,
  (state) => state.needAssign.selected
);

export const teachingScheduleAssignSelectAssigned = createSelector(
  assignScheduleSelector,
  (state) => state.assigned.data
);

export const teachingScheduleAssignSelectSelectedAssigned = createSelector(
  assignScheduleSelector,
  (state) => state.assigned.selected
);

export const teachingScheduleAssignSelectFilterStatus = createSelector(
  assignScheduleSelector,
  (state) => state.status.filter
);

export const teachingScheduleAssignSelectAssignStatus = createSelector(
  assignScheduleSelector,
  (state) => state.status.assign
);

export const teachingScheduleAssignSelectUnassignStatus = createSelector(
  assignScheduleSelector,
  (state) => state.status.unassign
);

const _selectTeacher = createSelector(
  assignScheduleSelector,
  (state) => state.teacher
);

export const teachingScheduleAssignSelectTeachers = createSelector(
  _selectTeacher,
  (teacher) => teacher.data
);

export const teachingScheduleAssignSelectSelectedTeacher = createSelector(
  _selectTeacher,
  (teacher) => teacher.selected
);

export const teachingScheduleAssignSelectActionTeacher = createSelector(
  _selectTeacher,
  (teacher) => teacher.action
);

export const teachingScheduleAssignSelectActionCountTeacher = createSelector(
  _selectTeacher,
  (teacher) => teacher.actionCount
);
