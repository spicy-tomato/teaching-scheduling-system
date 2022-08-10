import { createAction, props } from '@ngrx/store';

export const notification_getInitialData = createAction(
  '[Notification Page] Get initial data'
);

export const notification_getAll = createAction('[Notification Page] Get all');

export const notification_getUnread = createAction(
  '[Notification Page] Get unread'
);

export const actions = [notification_getAll, notification_getUnread];
export const notification_getData = (tab: number) => actions[tab];

export const notification_markAllAsRead = createAction(
  '[Notification Page] Mark all as read'
);

export const notification_markAsRead = createAction(
  '[Notification Page] Mark as read',
  props<{ id: number }>()
);
