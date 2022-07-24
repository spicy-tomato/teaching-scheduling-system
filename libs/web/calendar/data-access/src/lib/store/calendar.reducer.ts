import { createReducer, on } from '@ngrx/store';
import { TuiMonth } from '@taiga-ui/cdk';
import { ArrayHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { CalendarState } from '.';
import * as ApiAction from './calendar.api.actions';
import * as PageAction from './calendar.page.actions';

const initialState: CalendarState = {
  status: 'unknown',
  filter: {
    active: {
      showDepartmentSchedule: false,
      teacherIds: [],
      modules: [],
    },
    selecting: {
      showDepartmentSchedule: false,
      teacherIds: [],
      modules: [],
    },
  },
  schedules: {
    department: {
      exam: [],
      study: [],
      ranges: [],
    },
    personal: {
      exam: [],
      study: [],
      ranges: [],
    },
  },
  view: 'Month',
  selectedDate: new Date(),
  month: TuiMonth.currentLocal(),
};

export const calendarFeatureKey = 'calendar';

export const calendarReducer = createReducer(
  initialState,
  on(PageAction.calendarReset, () => initialState),
  on(PageAction.calendarLoad, (state) => ({
    ...state,
    status: 'loading',
  })),
  on(ApiAction.changeMonth, (state, { month, date: selectedDate }) => ({
    ...state,
    month,
    selectedDate,
  })),
  on(PageAction.calendarChangeView, (state, { view }) => ({
    ...state,
    view,
  })),
  on(PageAction.calendarFilter, (state) => ({
    ...state,
    filter: {
      ...state.filter,
      active: { ...state.filter.selecting },
    },
  })),
  on(PageAction.calendarResetFilter, (state) => ({
    ...state,
    filter: {
      ...state.filter,
      selecting: { ...state.filter.active },
    },
  })),
  on(PageAction.calendarChangeSelectingState, (state, { changes }) => ({
    ...state,
    filter: {
      ...state.filter,
      selecting: {
        ...state.filter.selecting,
        ...changes,
        modules: changes.modules || [],
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
      schedules: {
        ...state.schedules,
        personal: {
          ...state.schedules.personal,
          ranges,
          study: ArrayHelper.mergeWith(
            'id',
            state.schedules.personal.study,
            schedules
          ),
        },
      },
      status: 'successful',
    };
  }),
  on(ApiAction.loadPersonalExamSuccessful, (state, { schedules, ranges }) => {
    return {
      ...state,
      schedules: {
        ...state.schedules,
        personal: {
          ...state.schedules.personal,
          ranges,
          exam: ArrayHelper.mergeWith(
            'id',
            state.schedules.personal.exam,
            schedules
          ),
        },
      },
      status: 'successful',
    };
  }),
  on(
    ApiAction.loadDepartmentStudySuccessful,
    (state, { schedules, ranges }) => {
      return {
        ...state,
        schedules: {
          ...state.schedules,
          department: {
            ...state.schedules.department,
            ranges,
            study: ArrayHelper.mergeWith(
              'id',
              state.schedules.department.study,
              schedules
            ),
          },
        },
        status: 'successful',
      };
    }
  ),
  on(ApiAction.loadDepartmentExamSuccessful, (state, { schedules, ranges }) => {
    return {
      ...state,
      schedules: {
        ...state.schedules,
        department: {
          ...state.schedules.department,
          ranges,
          exam: ArrayHelper.mergeWith(
            'id',
            state.schedules.department.exam,
            schedules
          ),
        },
      },
      status: 'successful',
    };
  })
);
