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
    teacher: null,
    status: null,
    showTime: false,
    showTimeInsteadOfShift: false,
    showReason: true,
  },
  data: {
    changeSchedules: [],
    teachers: [],
  },
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
  on(PageAction.filter, (state, { query }) => ({
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
  on(PageAction.cancel, (state, { id }) => ({
    ...state,
    status: {
      ...state.status,
      queue: [...state.status.queue, id],
    },
  })),
  on(ApiAction.filterSuccessful, (state, { changeSchedulesResponse }) => {
    return {
      ...state,
      data: {
        ...state.data,
        changeSchedules: changeSchedulesResponse.data,
      },
      total: changeSchedulesResponse.meta.last_page,
      status: { ...state.status, data: EApiStatus.successful },
    };
  }),
  on(ApiAction.filterFailure, (state) => ({
    ...state,
    status: { ...state.status, data: EApiStatus.systemError },
  })),
  on(ApiAction.loadTeachersListSuccessful, (state, { teachers }) => {
    return {
      ...state,
      data: {
        ...state.data,
        teachers
      },
      status: { ...state.status, data: EApiStatus.successful },
    };
  }),
  on(ApiAction.loadTeachersListSuccessful, (state) => ({
    ...state,
    status: { ...state.status, data: EApiStatus.systemError },
  })),
  on(ApiAction.acceptSuccessful, (state, { id, status }) => {
    return {
      ...state,
      data: {
        ...state.data,
        changeSchedules: state.data.changeSchedules.map((x) => {
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
      },
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
      data: {
        ...state.data,
        changeSchedules: state.data.changeSchedules.map((x) => {
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
      },
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
      data: {
        ...state.data,
        changeSchedules: state.data.changeSchedules.map((x) => {
          if (x.id === id) {
            const newObj: ChangeSchedule = { ...x, status };
            return newObj;
          }
          return x;
        }),
      },
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
      data: {
        ...state.data,
        changeSchedules: state.data.changeSchedules.map((x) => {
          if (x.id === id) {
            const newObj: ChangeSchedule = { ...x, status: -3 };
            return newObj;
          }
          return x;
        }),
      },
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
