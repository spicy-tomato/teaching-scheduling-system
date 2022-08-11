import { createReducer, on } from '@ngrx/store';
import { StringHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { TeachingScheduleAssignState } from '.';
import * as ApiAction from './assign-schedule.api.actions';
import * as PageAction from './assign-schedule.page.actions';

const initialState: TeachingScheduleAssignState = {
  departments: [],
  data: [],
  selected: [],
  status: {
    filter: 'unknown',
    assign: 'unknown',
    unassign: 'unknown',
  },
  teacher: { data: [], selected: null, action: null, actionCount: 0 },
};

export const teachingScheduleAssignFeatureKey = 'teaching-schedule-assign';

export const teachingScheduleAssignReducer = createReducer(
  initialState,
  on(PageAction.teachingScheduleAssign_Reset, () => initialState),
  on(PageAction.teachingScheduleAssign_Filter, (state) => {
    return {
      ...state,
      status: { ...state.status, filter: 'loading' },
    };
  }),
  on(PageAction.teachingScheduleAssign_Assign, (state) => {
    return {
      ...state,
      status: { ...state.status, assign: 'loading' },
    };
  }),
  on(PageAction.teachingScheduleAssign_Unassign, (state) => {
    return {
      ...state,
      status: { ...state.status, unassign: 'loading' },
    };
  }),
  on(
    PageAction.teachingScheduleAssign_ChangeSelectingTeacher,
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
    PageAction.teachingScheduleAssign_ChangeSelected,
    (state, { classIds, checked }) => {
      return {
        ...state,
        selected: checked
          ? [...state.selected, ...classIds]
          : state.selected.filter((x) => !classIds.includes(x)),
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
    return {
      ...state,
      data: classes,
      status: { ...state.status, filter: 'successful' },
    };
  }),
  on(ApiAction.loadTeacherSuccessful, (state, { teachers }) => {
    const data = [...teachers];
    data.sort((a, b) => StringHelper.nameCompareFn(a.name, b.name));
    return {
      ...state,
      teacher: {
        data,
        selected: null,
        action: null,
        actionCount: 0,
      },
    };
  }),
  on(ApiAction.assignSuccessful, (state, { teacher, classIds }) => {
    const newState = structuredClone(state);
    newState.data.forEach((c) => {
      if (classIds.includes(c.id)) {
        c.teacher = teacher.name;
      }
    });
    const selected = state.selected.filter((s) => !classIds.includes(s));

    return {
      ...newState,
      selected,
      teacher: {
        ...state.teacher,
        selected: selected.length ? state.teacher.selected : null,
        action: teacher,
        actionCount: classIds.length,
      },
      status: { ...state.status, assign: 'successful' },
    };
  }),
  on(ApiAction.unassignSuccessful, (state, { classIds }) => {
    const newState = structuredClone(state);
    newState.data.forEach((c) => {
      if (classIds.includes(c.id)) {
        c.teacher = null;
      }
    });

    return {
      ...newState,
      teacher: {
        ...state.teacher,
        action: null,
        actionCount: classIds.length,
      },
      selected: state.selected.filter((s) => !classIds.includes(s)),
      status: { ...state.status, unassign: 'successful' },
    };
  })
);
