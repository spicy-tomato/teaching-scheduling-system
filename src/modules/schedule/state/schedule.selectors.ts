import { ExamScheduleModel } from '@models/schedule/exam-schedule.model';
import { StudyScheduleModel } from '@models/schedule/study-schedule.model';
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

const selectStudy = createSelector(
  selectSchedule,
  selectFilter,
  (schedules, filter) =>
    filter.showDepartmentSchedule
      ? schedules.department.study
      : schedules.personal.study
);

const selectExam = createSelector(
  selectSchedule,
  selectFilter,
  (schedules, filter) =>
    filter.showDepartmentSchedule
      ? schedules.department.exam
      : schedules.personal.exam
);

const selectScheduleWithType = createSelector(
  selectStudy,
  selectExam,
  (study, exam) => [...study, ...exam]
);

const selectDepartmentSchedule = createSelector(selectSchedule, (schedule) => [
  ...schedule.department.study,
  ...schedule.department.exam,
]);

export const selectTeachers = createSelector(
  selectDepartmentSchedule,
  (schedule) =>
    Array.from(
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
);

const selectSelectingDepartment = createSelector(
  scheduleSelector,
  (state) => state.selectingDepartment
);

export const selectModules = createSelector(
  scheduleSelector,
  selectSelectingDepartment,
  (state, selectingDepartment) =>
    Array.from(
      (selectingDepartment
        ? state.schedules.department.study
        : state.schedules.personal.study
      ).reduce((acc, curr) => {
        if (!acc.get(curr.moduleName)) {
          acc.set(curr.moduleName, true);
        }
        return acc;
      }, new Map<string, boolean>()),
      ([key]) => key
    )
);

export const selectFilteredSchedule = createSelector(
  selectScheduleWithType,
  selectFilter,
  (schedules, filter) => {
    const result =
      !filter.showDepartmentSchedule || filter.teachers.length === 0
        ? schedules
        : schedules.filter((schedule) =>
            schedule.people?.find((person) => filter.teachers.includes(person))
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
