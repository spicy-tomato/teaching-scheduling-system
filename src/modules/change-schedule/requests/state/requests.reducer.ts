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
    showReason: true,
  },
  changeSchedules: [],
  teachers: [],
  total: 0,
  query: {
    status: [],
    page: 1,
    pagination: 20,
  },
  exportIndexes: [],
};

export const requestsFeatureKey = 'requests';

export const requestsReducer = createReducer(
  initialState,
  on(PageAction.reset, () => initialState),
  on(PageAction.filter, (state, { query }) => ({
    ...state,
    query,
    exportIndexes: [],
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
  on(PageAction.changeSelectExport, (state, { selectExport }) => ({
    ...state,
    exportIndexes: selectExport,
  })),
  on(ApiAction.filterSuccessful, (state, { changeSchedulesResponse }) => {
    return {
      ...state,
      changeSchedules: changeSchedulesResponse.data,
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
      teachers,
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
      changeSchedules: state.changeSchedules.map((x) => {
        const current = new Date();
        if (x.id === id) {
          const newObj: ChangeSchedule = {
            ...x,
            status,
            acceptedAt: current,
            setRoomAt: status === 300 ? current : x.setRoomAt,
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
  on(ApiAction.setRoomSuccessful, (state, { id, room }) => {
    return {
      ...state,
      changeSchedules: state.changeSchedules.map((x) => {
        if (x.id === id) {
          const newObj: ChangeSchedule = {
            ...x,
            status: 300,
            setRoomAt: new Date(),
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
          const newObj: ChangeSchedule = { ...x, status: 100 };
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
