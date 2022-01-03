import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from '@shared/enums';
import { RequestsState } from '.';
import * as ApiAction from './requests.api.actions';
import * as PageAction from './requests.page.actions';

const initialState: RequestsState = {
  status: {
    data: EApiStatus.unknown,
    queue: [],
  },
  options: {
    selectedStatus: null,
    showTime: false,
    showTimeInsteadOfShift: false,
  },
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
    status: { ...state.status, data: EApiStatus.loading },
  })),
  on(PageAction.changeOptions, (state, { options }) => ({
    ...state,
    options: { ...state.options, ...options },
  })),
  on(PageAction.accept, (state, { id }) => ({
    ...state,
    status: {
      ...state.status,
      queue: [...state.status.queue, id],
    },
  })),
  on(PageAction.deny, (state, { id }) => ({
    ...state,
    status: {
      ...state.status,
      queue: [...state.status.queue, id],
    },
  })),
  on(ApiAction.loadSuccessful, (state, { changeSchedulesResponse }) => {
    return {
      ...state,
      changeSchedules: changeSchedulesResponse.data,
      total: changeSchedulesResponse.meta.last_page,
      status: { ...state.status, data: EApiStatus.successful },
    };
  }),
  on(ApiAction.loadFailure, (state) => ({
    ...state,
    status: { ...state.status, data: EApiStatus.systemError },
  })),
  on(ApiAction.acceptSuccessful, (state, { id }) => {
    return {
      ...state,
      changeSchedules: state.changeSchedules.map((x) => {
        if (x.id === id) {
          const newObj = { ...x, status: 1 };
          return newObj;
        }
        return x;
      }),
      status: {
        ...state.status,
        queue: state.status.queue.filter((x) => x !== id),
      },
    };
  }),
  on(ApiAction.acceptFailure, (state) => ({
    ...state,
    status: { ...state.status, accept: EApiStatus.systemError },
  })),
  on(ApiAction.denySuccessful, (state, { id }) => {
    return {
      ...state,
      changeSchedules: state.changeSchedules.map((x) => {
        if (x.id === id) {
          const newObj = { ...x, status: -1 };
          return newObj;
        }
        return x;
      }),
      status: {
        ...state.status,
        queue: state.status.queue.filter((x) => x !== id),
      },
    };
  }),
  on(ApiAction.denyFailure, (state) => ({
    ...state,
    status: { ...state.status, deny: EApiStatus.systemError },
  }))
);
