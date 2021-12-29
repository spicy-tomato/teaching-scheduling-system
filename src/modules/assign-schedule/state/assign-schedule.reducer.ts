import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from 'src/shared/enums/api-status.enum';
import { ArrayHelper } from 'src/shared/helpers/array.helper';
import { ModuleClass } from 'src/shared/models';
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
  status: {
    filter: EApiStatus.unknown,
    assign: EApiStatus.unknown,
    unassign: EApiStatus.unknown,
  },
  teacher: { data: [], selected: null, action: null, actionCount: 0 },
};

export const assignScheduleFeatureKey = 'assign-schedule';

export const assignScheduleReducer = createReducer(
  initialState,
  on(PageAction.reset, () => initialState),
  on(PageAction.filter, (state) => {
    return {
      ...state,
      status: { ...state.status, filter: EApiStatus.loading },
    };
  }),
  on(PageAction.assign, (state) => {
    return {
      ...state,
      status: { ...state.status, assign: EApiStatus.loading },
    };
  }),
  on(PageAction.unassign, (state) => {
    return {
      ...state,
      status: { ...state.status, unassign: EApiStatus.loading },
    };
  }),
  on(PageAction.changeSelectingTeacher, (state, { teacher }) => {
    return {
      ...state,
      teacher: {
        ...state.teacher,
        selected: teacher,
      },
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
      status: { ...state.status, filter: EApiStatus.successful },
    };
  }),
  on(ApiAction.loadTeacherSuccessful, (state, { teachers }) => {
    return {
      ...state,
      teacher: { data: teachers, selected: null, action: null, actionCount: 0 },
    };
  }),
  on(ApiAction.assignSuccessful, (state, { teacher }) => {
    const [needAssign, assigned] = ArrayHelper.filterTwoParts(
      state.needAssign.data,
      (_, i) => !state.needAssign.selected[i]
    );
    const justAssignedClasses = assigned.map((x) => ({
      ...x,
      teacher: teacher.name,
    }));

    return {
      ...state,
      needAssign: {
        data: needAssign,
        selected: [],
      },
      assigned: {
        data: [...state.assigned.data, ...justAssignedClasses],
        selected: [],
      },
      teacher: {
        ...state.teacher,
        action: teacher,
        actionCount: justAssignedClasses.length,
      },
      status: { ...state.status, assign: EApiStatus.successful },
    };
  }),
  on(ApiAction.unassignSuccessful, (state) => {
    const [assigned, needAssign] = ArrayHelper.filterTwoParts(
      state.assigned.data,
      (_, i) => !state.assigned.selected[i]
    );
    const justUnassignedClasses = needAssign.map((x) => ({
      ...x,
      teacher: undefined,
    }));

    return {
      ...state,
      needAssign: {
        data: [...state.needAssign.data, ...justUnassignedClasses],
        selected: [],
      },
      assigned: {
        data: assigned,
        selected: [],
      },
      teacher: {
        ...state.teacher,
        action: null,
        actionCount: justUnassignedClasses.length,
      },
      status: { ...state.status, unassign: EApiStatus.successful },
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
