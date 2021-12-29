import { createFeatureSelector, createSelector } from '@ngrx/store';
import { scheduleFeatureKey, ScheduleState } from '.';

const scheduleSelector =
  createFeatureSelector<ScheduleState>(scheduleFeatureKey);

export const selectSelectedDate = createSelector(
  scheduleSelector,
  (state) => state.selectedDate
);

export const selectMonth = createSelector(
  scheduleSelector,
  (state) => state.month
);

export const selectView = createSelector(
  scheduleSelector,
  (state) => state.view
);

export const selectStatus = createSelector(
  scheduleSelector,
  (state) => state.status
);

export const selectFilter = createSelector(
  scheduleSelector,
  (state) => state.filter
);

const selectSchedule = createSelector(
  scheduleSelector,
  (state) => state.schedules
);

const selectScheduleWithType = createSelector(
  selectSchedule,
  selectFilter,
  (schedules, filter) =>
    filter.showDepartmentSchedule
      ? [...schedules.department.exam, ...schedules.department.study]
      : [...schedules.personal.exam, ...schedules.personal.study]
);

export const selectTeachers = createSelector(
  selectScheduleWithType,
  selectFilter,
  (schedule, filter) =>
    filter.showDepartmentSchedule
      ? Array.from(
          schedule.reduce((acc, curr) => {
            curr.people?.forEach((person) => {
              if (!acc.get(person)) {
                acc.set(person, true);
              }
            });
            return acc;
          }, new Map<string, boolean>()),
          ([key]) => key
        )
      : []
);

export const selectFilteredSchedule = createSelector(
  selectScheduleWithType,
  selectTeachers,
  selectFilter,
  (schedules, teachers, filter) => {
    console.log(schedules, teachers);
    return teachers.length === 0 || filter.teachers.length === 0
      ? schedules
      : schedules.filter((schedule) =>
          schedule.people?.find((person) => filter.teachers.includes(person))
        );
  }
);
