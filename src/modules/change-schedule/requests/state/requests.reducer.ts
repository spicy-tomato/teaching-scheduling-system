import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from '@shared/enums';
import { RequestsState } from '.';
import * as ApiAction from './requests.api.actions';
import * as PageAction from './requests.page.actions';

const initialState: RequestsState = {
  status: EApiStatus.unknown,
  changeSchedules: [],
  total: 0,
  query: {
    status: 'all',
    page: 1,
  },
};

export const requestsFeatureKey = 'requests';

export const requestsReducer = createReducer(
  initialState,
  on(PageAction.reset, () => initialState),
  on(PageAction.load, (state, { query }) => ({
    ...state,
    query,
    status: EApiStatus.loading,
  })),
  on(ApiAction.loadSuccessful, (state, { changeSchedulesResponse }) => {
    return {
      ...state,
      changeSchedules: changeSchedulesResponse.data,
      total: changeSchedulesResponse.meta.total,
      status: EApiStatus.successful,
    };
  }),
  on(ApiAction.loadFailure, (state) => ({
    ...state,
    status: EApiStatus.clientError,
  }))
);
