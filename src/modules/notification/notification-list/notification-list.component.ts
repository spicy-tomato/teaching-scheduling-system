import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tss-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationListComponent {}
