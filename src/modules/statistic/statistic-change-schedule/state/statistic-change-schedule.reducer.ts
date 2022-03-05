import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from '@shared/enums';
import { StatisticChangeScheduleState } from '.';
import * as ApiAction from './statistic-change-schedule.api.actions';
import * as PageAction from './statistic-change-schedule.page.actions';

const initialState: StatisticChangeScheduleState = {
  status: EApiStatus.unknown,
  changeSchedules: [],
  teachersList: [],
};

export const statisticChangeScheduleFeatureKey = 'statisticChangeSchedule';

export const statisticChangeScheduleReducer = createReducer(
  initialState,
  on(PageAction.reset, () => initialState),
  on(PageAction.statisticize, (state) => ({
    ...state,
    status: EApiStatus.loading,
  })),
  on(ApiAction.statisticizeSuccessful, (state, { changeSchedules }) => ({
    ...state,
    changeSchedules,
    status: EApiStatus.successful,
  })),
  on(ApiAction.statisticizeFailure, (state) => ({
    ...state,
    status: EApiStatus.systemError,
  })),
  on(ApiAction.loadTeacherListSuccessful, (state, { teachersList }) => ({
    ...state,
    teachersList,
  })),
  on(ApiAction.loadTeacherListFailure, (state) => ({
    ...state,
    status: EApiStatus.systemError,
  }))
);
