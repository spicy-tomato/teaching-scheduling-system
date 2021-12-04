import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from 'src/enums/api-status.enum';
import { ScheduleState } from '.';
import * as ApiAction from './schedule.api.actions';
import * as PageAction from './schedule.page.actions';

const initialState: ScheduleState = {
  status: EApiStatus.unknown,
  schedules: [],
};

export const scheduleFeatureKey = 'schedule';

export const scheduleReducer = createReducer(
  initialState,
  on(PageAction.load, (state) => ({
    ...state,
    status: EApiStatus.loading,
  })),
  on(ApiAction.loadSuccessful, (state, { schedules }) => {
    return {
      ...state,
      schedules,
      status: EApiStatus.successful,
    };
  }),
  on(ApiAction.loadFailure, (state) => ({
    ...state,
    status: EApiStatus.systemError,
  }))
);
