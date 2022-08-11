import { InjectionToken, ValueProvider } from '@angular/core';

export interface NotificationListOptions {
  readonly forBell: boolean;
}

const NOTIFICATION_LIST_DEFAULT_OPTIONS: NotificationListOptions = {
  forBell: true,
};

export const NOTIFICATION_LIST_OPTIONS = new InjectionToken(
  'notificationList',
  {
    factory: () => NOTIFICATION_LIST_DEFAULT_OPTIONS,
  }
);

export const notificationListOptionsProvider: (
  options: Partial<NotificationListOptions>
) => ValueProvider = (options: Partial<NotificationListOptions>) => ({
  provide: NOTIFICATION_LIST_OPTIONS,
  useValue: { ...NOTIFICATION_LIST_DEFAULT_OPTIONS, ...options },
});
