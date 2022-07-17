import { createReducer, on } from '@ngrx/store';
import { ChangeSchedule } from '@teaching-scheduling-system/web/shared/data-access/models';
import * as ApiAction from './requests.api.actions';
import * as PageAction from './requests.page.actions';
import { TeachingScheduleRequestState } from './requests.state';

const initialState: TeachingScheduleRequestState = {
  status: {
    data: 'unknown',
    queue: [],
  },
  options: {
    teacher: null,
    status: null,
    showTime: false,
    showReason: true,
  },
  changeSchedules: [],
  total: 0,
  query: {
    status: [],
    page: 1,
    pagination: 20,
  },
  exportIndexes: [],
};

export const teachingScheduleRequestFeatureKey = 'teaching-schedule-requests';

export const teachingScheduleRequestReducer = createReducer(
  initialState,
  on(PageAction.teachingScheduleRequestReset, () => initialState),
  on(PageAction.teachingScheduleRequestFilter, (state, { query }) => ({
    ...state,
    query,
    exportIndexes: [],
    status: { ...state.status, data: 'loading' },
  })),
  on(PageAction.teachingScheduleRequestChangeOptions, (state, { options }) => ({
    ...state,
    options: { ...state.options, ...options },
  })),
  on(PageAction.teachingScheduleRequestAccept, (state, { schedule }) => ({
    ...state,
    status: {
      ...state.status,
      queue: [...state.status.queue, schedule.id],
    },
  })),
  on(PageAction.teachingScheduleRequestSetRoom, (state, { schedule }) => ({
    ...state,
    status: {
      ...state.status,
      queue: [...state.status.queue, schedule.id],
    },
  })),
  on(PageAction.teachingScheduleRequestDeny, (state, { schedule }) => ({
    ...state,
    status: {
      ...state.status,
      queue: [...state.status.queue, schedule.id],
    },
  })),
  on(PageAction.teachingScheduleRequestCancel, (state, { id }) => ({
    ...state,
    status: {
      ...state.status,
      queue: [...state.status.queue, id],
    },
  })),
  on(
    PageAction.teachingScheduleRequestChangeSelectExport,
    (state, { selectExport }) => ({
      ...state,
      exportIndexes: selectExport,
    })
  ),
  on(ApiAction.filterSuccessful, (state, { changeSchedulesResponse }) => {
    return {
      ...state,
      changeSchedules: changeSchedulesResponse.data,
      total: changeSchedulesResponse.meta.last_page,
      status: { ...state.status, data: 'successful' },
    };
  }),
  on(ApiAction.filterFailure, (state) => ({
    ...state,
    status: { ...state.status, data: 'systemError' },
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
    status: { ...state.status, accept: 'systemError' },
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
    status: { ...state.status, accept: 'systemError' },
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
    status: { ...state.status, deny: 'systemError' },
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
    status: { ...state.status, deny: 'systemError' },
  }))
);
