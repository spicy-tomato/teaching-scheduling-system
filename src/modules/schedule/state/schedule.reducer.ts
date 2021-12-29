import { createReducer, on } from '@ngrx/store';
import { TuiMonth } from '@taiga-ui/cdk';
import { EApiStatus } from 'src/shared/enums/api-status.enum';
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
  selectedDate: new Date(),
  view: 'Month',
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
  on(PageAction.prev, (state, { oldSelectedDate }) => {
    switch (state.view) {
      case 'Month':
        oldSelectedDate.setMonth(oldSelectedDate.getMonth() - 1);
        break;
      case 'Week':
        oldSelectedDate.setDate(oldSelectedDate.getDate() - 7);
        break;
      case 'Day':
        oldSelectedDate.setDate(oldSelectedDate.getDate() - 1);
    }
    return {
      ...state,
      selectedDate: oldSelectedDate,
      month: new TuiMonth(
        oldSelectedDate.getFullYear(),
        oldSelectedDate.getMonth()
      ),
    };
  }),
  on(PageAction.next, (state, { oldSelectedDate }) => {
    switch (state.view) {
      case 'Month':
        oldSelectedDate.setMonth(oldSelectedDate.getMonth() + 1);
        break;
      case 'Week':
        oldSelectedDate.setDate(oldSelectedDate.getDate() + 7);
        break;
      case 'Day':
        oldSelectedDate.setDate(oldSelectedDate.getDate() + 1);
    }
    return {
      ...state,
      selectedDate: oldSelectedDate,
      month: new TuiMonth(
        oldSelectedDate.getFullYear(),
        oldSelectedDate.getMonth()
      ),
    };
  }),
  on(PageAction.changeMonth, (state, { month }) => ({
    ...state,
    month,
    selectedDate: new Date(month.year, month.month, new Date().getDate()),
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
  on(ApiAction.loadPersonalStudySuccessful, (state, { schedules }) => {
    return {
      ...state,
      schedules: {
        ...state.schedules,
        personal: {
          ...state.schedules.personal,
          study: schedules,
        },
      },
      status: EApiStatus.successful,
    };
  }),
  on(ApiAction.loadPersonalExamSuccessful, (state, { schedules }) => {
    return {
      ...state,
      schedules: {
        ...state.schedules,
        personal: {
          ...state.schedules.personal,
          exam: schedules,
        },
      },
      status: EApiStatus.successful,
    };
  }),
  on(ApiAction.loadDepartmentStudySuccessful, (state, { schedules }) => {
    return {
      ...state,
      schedules: {
        ...state.schedules,
        department: {
          ...state.schedules.personal,
          study: schedules,
        },
      },
      status: EApiStatus.successful,
    };
  }),
  on(ApiAction.loadDepartmentExamSuccessful, (state, { schedules }) => {
    return {
      ...state,
      schedules: {
        ...state.schedules,
        department: {
          ...state.schedules.personal,
          exam: schedules,
        },
      },
      status: EApiStatus.successful,
    };
  })
);
