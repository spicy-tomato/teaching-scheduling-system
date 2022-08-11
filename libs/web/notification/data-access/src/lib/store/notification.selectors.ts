import { createFeatureSelector, createSelector } from '@ngrx/store';
import { notificationFeatureKey } from './notification.reducer';
import { NotificationState, NotificationType } from './notification.state';

const notificationSelector = createFeatureSelector<NotificationState>(
  notificationFeatureKey
);

export const notification_selectProp = <T extends keyof NotificationType>(
  prop: T
) =>
  createSelector(notificationSelector, ({ all, unread }) =>
    [all, unread].map((x) => x[prop])
  );

export const notification_selectHasUnread = createSelector(
  notificationSelector,
  (state) => !!state.unread.data.length
);
