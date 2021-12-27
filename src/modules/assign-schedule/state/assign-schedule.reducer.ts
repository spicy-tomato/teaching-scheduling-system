import { ModuleClass } from '@models/class/module-class.model';
import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from 'src/shared/enums/api-status.enum';
import { ArrayHelper } from 'src/shared/helpers/array.helper';
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
  needAssign: { data: [], selected: [] },
  assigned: { data: [], selected: [] },
  status: EApiStatus.unknown,
  teachers: [],
  assignedSuccessful: {
    teacherName: '',
    classCount: 0,
  },
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
  on(PageAction.selectedNeedAssignChange, (state, { checkbox }) => {
    return {
      ...state,
      needAssign: { ...state.needAssign, selected: checkbox },
    };
  }),
  on(PageAction.selectedAssignedChange, (state, { checkbox }) => {
    return {
      ...state,
      assigned: { ...state.assigned, selected: checkbox },
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
      needAssign: { data: needAssign, selected: [] },
      assigned: { data: assigned, selected: [] },
      status: EApiStatus.successful,
    };
  }),
  on(ApiAction.loadTeacherSuccessful, (state, { teachers }) => {
    return {
      ...state,
      teachers,
    };
  }),
  on(ApiAction.assignSuccessful, (state, { teacherName }) => {
    const afterAssigned = ArrayHelper.filterTwoParts(
      state.needAssign.data,
      (_, i) => !state.needAssign.selected[i]
    );
    const justAssignedClasses = afterAssigned[1].map((x) => ({
      ...x,
      teacher: teacherName,
    }));

    return {
      ...state,
      needAssign: {
        data: afterAssigned[0],
        selected: [],
      },
      assigned: {
        data: [...state.assigned.data, ...justAssignedClasses],
        selected: [],
      },
      assignedSuccessful: {
        teacherName,
        classCount: justAssignedClasses.length,
      },
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
