import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from '@shared/enums';
import { ChangeSchedule } from '@shared/models';
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
    showReason: true,
  },
  changeSchedules: [],
  total: 0,
  query: {
    status: 'all',
    page: 1,
    pagination: 20,
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
  on(PageAction.accept, (state, { schedule }) => ({
    ...state,
    status: {
      ...state.status,
      queue: [...state.status.queue, schedule.id],
    },
  })),
  on(PageAction.setRoom, (state, { schedule }) => ({
    ...state,
    status: {
      ...state.status,
      queue: [...state.status.queue, schedule.id],
    },
  })),
  on(PageAction.deny, (state, { schedule }) => ({
    ...state,
    status: {
      ...state.status,
      queue: [...state.status.queue, schedule.id],
    },
  })),
  on(PageAction.cancel, (state, { schedule }) => ({
    ...state,
    status: {
      ...state.status,
      queue: [...state.status.queue, schedule.id],
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
  on(ApiAction.acceptSuccessful, (state, { id, status }) => {
    return {
      ...state,
      changeSchedules: state.changeSchedules.map((x) => {
        const current = new Date();
        if (x.id === id) {
          const newObj: ChangeSchedule = {
            ...x,
            status,
            timeAccept: current,
            timeSetRoom: status === 3 ? current : x.timeSetRoom,
          };
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
  on(ApiAction.setRoomSuccessful, (state, { id, status, room }) => {
    return {
      ...state,
      changeSchedules: state.changeSchedules.map((x) => {
        if (x.id === id) {
          const newObj: ChangeSchedule = {
            ...x,
            status,
            timeSetRoom: new Date(),
            newSchedule: {
              ...x.newSchedule,
              room,
            },
          };
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
  on(ApiAction.setRoomFailure, (state) => ({
    ...state,
    status: { ...state.status, accept: EApiStatus.systemError },
  })),
  on(ApiAction.denySuccessful, (state, { id, status }) => {
    return {
      ...state,
      changeSchedules: state.changeSchedules.map((x) => {
        if (x.id === id) {
          const newObj: ChangeSchedule = { ...x, status };
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
  })),
  on(ApiAction.cancelSuccessful, (state, { id }) => {
    return {
      ...state,
      changeSchedules: state.changeSchedules.map((x) => {
        if (x.id === id) {
          const newObj: ChangeSchedule = { ...x, status: -3 };
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
  on(ApiAction.cancelFailure, (state) => ({
    ...state,
    status: { ...state.status, deny: EApiStatus.systemError },
  }))
);
