import { ModuleClass } from '@models/class/module-class.model';
import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from 'src/shared/enums/api-status.enum';
import { AssignScheduleState } from '.';
import * as ApiAction from './assign-schedule.api.actions';
import * as PageAction from './assign-schedule.page.actions';

type ModuleClassList = {
  needAssign: ModuleClass[];
  assigned: ModuleClass[];
};

const initialState: AssignScheduleState = {
  currentTerm: '',
  academicYears: {},
  departments: [],
  needAssign: [],
  assigned: [],
  status: EApiStatus.unknown,
  teachers: [],
};

export const assignScheduleFeatureKey = 'assign-schedule';

export const assignScheduleReducer = createReducer(
  initialState,
  on(PageAction.reset, () => initialState),
  on(PageAction.filter, (state) => {
    return {
      ...state,
      status: EApiStatus.loading,
    };
  }),
  on(ApiAction.loadCurrentTermSuccessful, (state, { currentTerm }) => {
    return {
      ...state,
      currentTerm,
    };
  }),
  on(ApiAction.loadAcademicYearSuccessful, (state, { academicYears }) => {
    return {
      ...state,
      academicYears,
    };
  }),
  on(ApiAction.loadDepartmentSuccessful, (state, { departments }) => {
    return {
      ...state,
      departments,
    };
  }),
  on(ApiAction.filterSuccessful, (state, { classes }) => {
    const { needAssign, assigned } = divideSchedule(classes);
    return {
      ...state,
      needAssign,
      assigned,
      status: EApiStatus.successful,
    };
  }),
  on(ApiAction.loadTeacherSuccessful, (state, { teachers }) => {
    return {
      ...state,
      teachers,
    };
  })
);

function divideSchedule(schedules: ModuleClass[]): ModuleClassList {
  return schedules.reduce<ModuleClassList>(
    (acc, curr) => {
      if (curr.teacher) {
        acc.assigned.push(curr);
      } else {
        acc.needAssign.push(curr);
      }
      return acc;
    },
    { needAssign: [], assigned: [] }
  );
}
