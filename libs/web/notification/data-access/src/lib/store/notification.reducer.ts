import { createReducer, on } from '@ngrx/store';
import { DateHelper } from '@teaching-scheduling-system/core/utils/helpers';
import * as ApiAction from './notification.api.actions';
import * as PageAction from './notification.page.actions';
import { NotificationState } from './notification.state';

const initialState: NotificationState = {
  all: {
    data: [],
    status: 'unknown',
    milestone: DateHelper.toSqlDate(new Date()),
    error: null,
    hasNext: false,
  },
  unread: {
    data: [],
    status: 'unknown',
    milestone: DateHelper.toSqlDate(new Date()),
    error: null,
    hasNext: false,
  },
};

export const notificationFeatureKey = 'notification';

export const notificationReducer = createReducer(
  initialState,
  on(PageAction.reset, () => initialState),
  on(PageAction.notification_getAll, (state) => ({
    ...state,
    all: {
      ...state.all,
      status: 'loading',
    },
  })),
  on(PageAction.notification_getUnread, (state) => ({
    ...state,
    unread: {
      ...state.unread,
      status: 'loading',
    },
  })),
  on(PageAction.notification_markAllAsRead, (state) => ({
    ...state,
    all: {
      ...state.all,
      data: state.all.data.map((x) => {
        if (x.readAt) {
          return x;
        }
        const copy = { ...x };
        copy.readAt = DateHelper.toSqlDate(new Date());
        return copy;
      }),
    },
    unread: {
      ...state.unread,
      data: [],
      hasNext: false,
    },
  })),
  on(PageAction.notification_markAsRead, (state, { id }) => ({
    ...state,
    all: {
      ...state.all,
      data: state.all.data.map((x) => {
        if (x.id !== id) {
          return x;
        }
        const copy = { ...x };
        copy.readAt = DateHelper.toSqlDate(new Date());
        return copy;
      }),
    },
    unread: {
      ...state.unread,
      data: state.unread.data.filter((x) => x.id !== id),
    },
  })),
  on(ApiAction.notification_getAllSuccessful, (state, { page }) => ({
    ...state,
    all: {
      ...state.all,
      data: [...state.all.data, ...page.data],
      status: 'successful',
      milestone: page.milestone,
      hasNext: page.hasNext,
    },
  })),
  on(ApiAction.notification_getUnreadSuccessful, (state, { page }) => ({
    ...state,
    unread: {
      ...state.unread,
      data: [...state.unread.data, ...page.data],
      status: 'successful',
      milestone: page.milestone,
      hasNext: page.hasNext,
    },
  })),
  on(ApiAction.notification_getAllFailed, (state) => ({
    ...state,
    all: {
      ...state.all,
      status: 'systemError',
    },
  })),
  on(ApiAction.notification_getUnreadFailed, (state) => ({
    ...state,
    unread: {
      ...state.unread,
      status: 'systemError',
    },
  })),
  on(ApiAction.notification_add, (state, { notification }) => ({
    ...state,
    all: {
      ...state.all,
      data: [notification, ...state.all.data],
    },
    unread: {
      ...state.unread,
      data: [notification, ...state.unread.data],
    },
  }))
);
