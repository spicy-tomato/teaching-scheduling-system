import { createReducer, on } from '@ngrx/store';
import { ArrayHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import { ModuleClass } from '@teaching-scheduling-system/web/shared/data-access/models';
import { TeachingScheduleAssignState } from '.';
import * as ApiAction from './assign-schedule.api.actions';
import * as PageAction from './assign-schedule.page.actions';

type ModuleClassList = {
  needAssign: ModuleClass[];
  assigned: ModuleClass[];
};

const initialState: TeachingScheduleAssignState = {
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

export const teachingScheduleAssignFeatureKey = 'teaching-schedule-assign';

export const teachingScheduleAssignReducer = createReducer(
  initialState,
  on(PageAction.teachingScheduleAssignReset, () => initialState),
  on(PageAction.teachingScheduleAssignFilter, (state) => {
    return {
      ...state,
      status: { ...state.status, filter: EApiStatus.loading },
    };
  }),
  on(PageAction.teachingScheduleAssignAssign, (state) => {
    return {
      ...state,
      status: { ...state.status, assign: EApiStatus.loading },
    };
  }),
  on(PageAction.teachingScheduleAssignUnassign, (state) => {
    return {
      ...state,
      status: { ...state.status, unassign: EApiStatus.loading },
    };
  }),
  on(
    PageAction.teachingScheduleAssignChangeSelectingTeacher,
    (state, { teacher }) => {
      return {
        ...state,
        teacher: {
          ...state.teacher,
          selected: teacher,
        },
      };
    }
  ),
  on(
    PageAction.teachingScheduleAssignSelectedNeedAssignChange,
    (state, { checkbox }) => {
      return {
        ...state,
        needAssign: { ...state.needAssign, selected: checkbox },
      };
    }
  ),
  on(
    PageAction.teachingScheduleAssignSelectedAssignedChange,
    (state, { checkbox }) => {
      return {
        ...state,
        assigned: { ...state.assigned, selected: checkbox },
      };
    }
  ),
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
      teacher: null,
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
