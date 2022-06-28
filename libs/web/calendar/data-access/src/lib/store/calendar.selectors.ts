import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  SimpleModel,
  ExamScheduleModel,
  StudyScheduleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { calendarFeatureKey, CalendarState } from '.';

const calendarSelector =
  createFeatureSelector<CalendarState>(calendarFeatureKey);

export const calendarSelectSelectedDate = createSelector(
  calendarSelector,
  (state) => state.selectedDate
);

export const calendarSelectMonth = createSelector(
  calendarSelector,
  (state) => state.month
);

export const calendarSelectView = createSelector(
  calendarSelector,
  (state) => state.view
);

export const calendarSelectStatus = createSelector(
  calendarSelector,
  (state) => state.status
);

export const calendarSelectRanges = createSelector(
  calendarSelector,
  (state) => ({
    personal: state.schedules.personal.ranges,
    department: state.schedules.department.ranges,
  })
);

const calendarSelectFilterStates = createSelector(
  calendarSelector,
  (state) => state.filter
);

export const calendarSelectFilter = createSelector(
  calendarSelectFilterStates,
  (filter) => filter.active
);

const calendarSelectSchedule = createSelector(
  calendarSelector,
  (state) => state.schedules
);

const calendarSelectStudy = createSelector(
  calendarSelectSchedule,
  calendarSelectFilter,
  (schedules, filter) =>
    filter.showDepartmentSchedule
      ? schedules.department.study
      : schedules.personal.study
);

const calendarSelectExam = createSelector(
  calendarSelectSchedule,
  calendarSelectFilter,
  (schedules, filter) =>
    filter.showDepartmentSchedule
      ? schedules.department.exam
      : schedules.personal.exam
);

const calendarSelectScheduleWithType = createSelector(
  calendarSelectStudy,
  calendarSelectExam,
  (study, exam) => [...study, ...exam]
);

const calendarSelectDepartmentSchedule = createSelector(
  calendarSelectSchedule,
  (schedule) => [...schedule.department.study, ...schedule.department.exam]
);

export const calendarSelectTeachers = createSelector(
  calendarSelectDepartmentSchedule,
  (schedule) =>
    Array.from(
      schedule.reduce((acc, curr) => {
        curr.people?.forEach((person) => {
          const id = (person as SimpleModel).id;
          if (id && !acc.get(id)) {
            acc.set(id, (person as SimpleModel).name);
          }
        });
        return acc;
      }, new Map<string, string>()),
      ([id, name]) => ({ id, name })
    )
);

const calendarSelectSelectingDepartment = createSelector(
  calendarSelectFilterStates,
  (filter) => filter.selecting.showDepartmentSchedule
);

const calendarSelectSelectingTeachers = createSelector(
  calendarSelectFilterStates,
  (filter) => filter.selecting.teachers
);

export const calendarSelectModules = createSelector(
  calendarSelector,
  calendarSelectSelectingDepartment,
  calendarSelectSelectingTeachers,
  (state, selectingDepartment, selectingTeachers) => {
    const schedules = selectingDepartment
      ? state.schedules.department.study
      : state.schedules.personal.study;

    if (!selectingDepartment || selectingTeachers.length === 0) {
      return Array.from(
        schedules.reduce((acc, curr) => {
          if (!acc.get(curr.moduleName)) {
            acc.set(curr.moduleName, true);
          }
          return acc;
        }, new Map<string, boolean>()),
        ([key]) => key
      );
    }

    return Array.from(
      schedules.reduce((acc, curr) => {
        if (
          !acc.get(curr.moduleName) &&
          (curr.people as SimpleModel[])?.find((person) =>
            selectingTeachers.find((p) => p.id === person.id)
          )
        ) {
          acc.set(curr.moduleName, true);
        }
        return acc;
      }, new Map<string, boolean>()),
      ([key]) => key
    );
  }
);

export const calendarSelectFilteredSchedule = createSelector(
  calendarSelectScheduleWithType,
  calendarSelectFilter,
  (schedules, filter) => {
    const result =
      !filter.showDepartmentSchedule || filter.teachers.length === 0
        ? schedules
        : schedules.filter((schedule) =>
            (schedule.people as SimpleModel[])?.find((person) =>
              filter.teachers.find((p) => p.id === person.id)
            )
          );
    return filter.modules.length === 0
      ? result
      : result.filter(
          (schedule) =>
            schedule instanceof ExamScheduleModel ||
            (schedule instanceof StudyScheduleModel &&
              filter.modules.includes(schedule.moduleName))
        );
  }
);
