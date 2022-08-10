import { ChangeDetectionStrategy, Component } from '@angular/core';
import { notificationListOptionsProvider } from '@teaching-scheduling-system/web/notification/ui/notification-list';

@Component({
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [notificationListOptionsProvider({ forBell: false })],
})
export class NotificationComponent {}
