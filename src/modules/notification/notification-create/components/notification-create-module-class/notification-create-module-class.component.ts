import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotificationCreateClassFormBaseComponent } from '../class-form-base/notification-create-class-form-base.component';

@Component({
  selector: 'tss-notification-create-module-class',
  templateUrl: './notification-create-module-class.component.html',
  styleUrls: ['./notification-create-module-class.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationCreateModuleClassComponent extends NotificationCreateClassFormBaseComponent {
  constructor(protected fb: FormBuilder) {
    super(fb);
  }
}
