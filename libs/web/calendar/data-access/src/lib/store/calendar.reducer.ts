import { createReducer, on } from '@ngrx/store';
import { TuiMonth } from '@taiga-ui/cdk';
import { ArrayHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  EjsScheduleModel,
  StudyScheduleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { CalendarState } from '.';
import * as ApiAction from './calendar.api.actions';
import * as PageAction from './calendar.page.actions';

const initialState: CalendarState = {
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

export const calendarFeatureKey = 'schedule';

export const calendarReducer = createReducer(
  initialState,
  on(PageAction.calendarReset, () => initialState),
  on(PageAction.calendarLoad, (state) => ({
    ...state,
    status: EApiStatus.loading,
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
  on(PageAction.calendarFilter, (state, { filter }) => ({
    ...state,
    filter: {
      ...state.filter,
      active: filter,
    },
  })),
  on(PageAction.calendarChangeSelectingState, (state, { changes }) => ({
    ...state,
    filter: {
      ...state.filter,
      selecting: {
        ...state.filter.selecting,
        ...changes,
      },
    },
  })),
  on(PageAction.calendarChangeScheduleInDialog, (state, { schedules }) => ({
    ...state,
    schedules: {
      personal: {
        ...state.schedules.personal,
        study: updateSchedule(state.schedules.personal.study, schedules),
      },
      department: {
        ...state.schedules.department,
        study: updateSchedule(state.schedules.department.study, schedules),
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
      status: EApiStatus.successful,
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
      status: EApiStatus.successful,
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
        status: EApiStatus.successful,
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
      status: EApiStatus.successful,
    };
  })
);

function updateSchedule(
  oldSchedules: StudyScheduleModel[],
  schedules: EjsScheduleModel[]
): StudyScheduleModel[] {
  schedules.forEach((s) => {
    let scheduleNeedToChange = oldSchedules.find((os) => os.id === s.Id);
    if (!scheduleNeedToChange) {
      return;
    }

    scheduleNeedToChange = StudyScheduleModel.parse(scheduleNeedToChange);
    if (s.FixedSchedules) {
      scheduleNeedToChange.fixedSchedules = s.FixedSchedules;
    }
    scheduleNeedToChange.note = s.Note;
  });

  return oldSchedules;
}
