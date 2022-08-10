import { createAction, props } from '@ngrx/store';
import { EchoMessage } from '../models';
import { NotificationPage } from '../models/notification.model';

export const notification_getAllSuccessful = createAction(
  '[Notification Page] Get all successfully',
  props<{ page: NotificationPage }>()
);

export const notification_getAllFailed = createAction(
  '[Notification Page] Get all failed'
);

export const notification_getUnreadSuccessful = createAction(
  '[Notification Page] Get unread successfully',
  props<{ page: NotificationPage }>()
);

export const notification_getUnreadFailed = createAction(
  '[Notification Page] Get unread failed'
);

export const notification_markAllAsReadSuccessful = createAction(
  '[Notification Page] Mark all as read successfully'
);

export const notification_markAllAsReadFailed = createAction(
  '[Notification Page] Mark all as read failed'
);

export const notification_markAsReadSuccessful = createAction(
  '[Notification Page] Mark as read successfully',
  props<{ id: number }>()
);

export const notification_markAsReadFailed = createAction(
  '[Notification Page] Mark as read failed'
);

export const notification_add = createAction(
  '[Notification Page] Add',
  props<{ notification: EchoMessage }>()
);
