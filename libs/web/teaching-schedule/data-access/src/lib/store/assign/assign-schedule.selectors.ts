import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  teachingScheduleAssignFeatureKey,
  TeachingScheduleAssignState,
} from '.';

const assignScheduleSelector =
  createFeatureSelector<TeachingScheduleAssignState>(
    teachingScheduleAssignFeatureKey
  );

export const teachingScheduleAssign_SelectDepartments = createSelector(
  assignScheduleSelector,
  (state) => state.departments
);

export const teachingScheduleAssign_SelectFilterStatus = createSelector(
  assignScheduleSelector,
  (state) => state.status.filter
);

export const teachingScheduleAssign_SelectAssignStatus = createSelector(
  assignScheduleSelector,
  (state) => state.status.assign
);

export const teachingScheduleAssign_SelectUnassignStatus = createSelector(
  assignScheduleSelector,
  (state) => state.status.unassign
);

const _selectTeacher = createSelector(
  assignScheduleSelector,
  (state) => state.teacher
);

export const teachingScheduleAssign_SelectTeachers = createSelector(
  _selectTeacher,
  (teacher) => teacher.data
);

export const teachingScheduleAssign_SelectSelectedTeacher = createSelector(
  _selectTeacher,
  (teacher) => teacher.selected
);

export const teachingScheduleAssign_SelectActionTeacher = createSelector(
  _selectTeacher,
  (teacher) => teacher.action
);

export const teachingScheduleAssign_SelectActionCountTeacher = createSelector(
  _selectTeacher,
  (teacher) => teacher.actionCount
);

const _selectData = createSelector(
  assignScheduleSelector,
  (state) => state.data
);

const _selectSelected = createSelector(
  assignScheduleSelector,
  (state) => state.selected
);

export const teachingScheduleAssign_SelectNeedAssign = createSelector(
  _selectData,
  (data) => data.filter((x) => !x.teacher)
);

export const teachingScheduleAssign_SelectSelectedNeedAssign = createSelector(
  teachingScheduleAssign_SelectNeedAssign,
  _selectSelected,
  (needAssignSchedule, selected) =>
    needAssignSchedule.filter((x) => selected.includes(x.id))
);

export const teachingScheduleAssign_SelectAssigned = createSelector(
  _selectData,
  (data) => data.filter((x) => !!x.teacher)
);

export const teachingScheduleAssign_SelectSelectedAssigned = createSelector(
  teachingScheduleAssign_SelectAssigned,
  _selectSelected,
  _selectTeacher,
  (assignedSchedule, selected, teacher) =>
    assignedSchedule.filter(
      (x) =>
        (!teacher.selected || x.teacher === teacher.selected?.name) &&
        selected.includes(x.id)
    )
);
