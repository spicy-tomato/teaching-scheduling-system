import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tss-notification-create',
  templateUrl: './notification-create.component.html',
  styleUrls: ['./notification-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationCreateComponent { }
