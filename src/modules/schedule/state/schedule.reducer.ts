import { createReducer, on } from '@ngrx/store';
import { TuiMonth } from '@taiga-ui/cdk';
import { EApiStatus } from '@shared/enums';
import { ScheduleState } from '.';
import * as ApiAction from './schedule.api.actions';
import * as PageAction from './schedule.page.actions';

const initialState: ScheduleState = {
  status: EApiStatus.unknown,
  filter: {
    active: {
      showDepartmentSchedule: false,
      teachers: [],
      modules: [],
    },
    selecting: {
      showDepartmentSchedule: false,
      teachers: [],
      modules: [],
    },
  },
  schedules: {
    department: {
      exam: [],
      study: [],
    },
    personal: {
      exam: [],
      study: [],
    },
  },
  ranges: [],
  view: 'Month',
  selectedDate: new Date(),
  month: new TuiMonth(new Date().getFullYear(), new Date().getMonth()),
};

export const scheduleFeatureKey = 'schedule';

export const scheduleReducer = createReducer(
  initialState,
  on(PageAction.reset, () => initialState),
  on(PageAction.load, (state) => ({
    ...state,
    status: EApiStatus.loading,
  })),
  on(ApiAction.changeMonth, (state, { month, date: selectedDate }) => ({
    ...state,
    month,
    selectedDate,
  })),
  on(PageAction.changeView, (state, { view }) => ({
    ...state,
    view,
  })),
  on(PageAction.filter, (state, { filter }) => ({
    ...state,
    filter: {
      ...state.filter,
      active: filter,
    },
  })),
  on(PageAction.changeSelectingState, (state, { changes }) => ({
    ...state,
    filter: {
      ...state.filter,
      selecting: {
        ...state.filter.selecting,
        ...changes,
      },
    },
  })),
  on(ApiAction.prev, (state, { date }) => {
    return {
      ...state,
      selectedDate: date,
      month: new TuiMonth(date.getFullYear(), date.getMonth()),
    };
  }),
  on(ApiAction.next, (state, { date }) => {
    return {
      ...state,
      selectedDate: date,
      month: new TuiMonth(date.getFullYear(), date.getMonth()),
    };
  }),
  on(ApiAction.loadPersonalStudySuccessful, (state, { schedules, ranges }) => {
    return {
      ...state,
      ranges,
      schedules: {
        ...state.schedules,
        personal: {
          ...state.schedules.personal,
          study: [...state.schedules.personal.study, ...schedules],
        },
      },
      status: EApiStatus.successful,
    };
  }),
  on(ApiAction.loadPersonalExamSuccessful, (state, { schedules, ranges }) => {
    return {
      ...state,
      ranges,
      schedules: {
        ...state.schedules,
        personal: {
          ...state.schedules.personal,
          exam: [...state.schedules.personal.exam, ...schedules],
        },
      },
      status: EApiStatus.successful,
    };
  }),
  on(
    ApiAction.loadDepartmentStudySuccessful,
    (state, { schedules, ranges }) => {
      return {
        ...state,
        ranges,
        schedules: {
          ...state.schedules,
          department: {
            ...state.schedules.personal,
            study: [...state.schedules.department.study, ...schedules],
          },
        },
        status: EApiStatus.successful,
      };
    }
  ),
  on(ApiAction.loadDepartmentExamSuccessful, (state, { schedules, ranges }) => {
    return {
      ...state,
      ranges,
      schedules: {
        ...state.schedules,
        department: {
          ...state.schedules.personal,
          exam: [...state.schedules.department.exam, ...schedules],
        },
      },
      status: EApiStatus.successful,
    };
  })
);
