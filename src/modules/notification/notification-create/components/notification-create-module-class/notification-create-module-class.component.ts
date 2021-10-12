import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NotificationCreateState } from '../../state/notification-create.state';
import { NotificationCreateClassFormBaseComponent } from '../class-form-base/notification-create-class-form-base.component';

@Component({
  selector: 'tss-notification-create-module-class',
  templateUrl: './notification-create-module-class.component.html',
  styleUrls: ['./notification-create-module-class.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NotificationCreateModuleClassComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NotificationCreateModuleClassComponent),
      multi: true
    }
  ]
})
export class NotificationCreateModuleClassComponent extends NotificationCreateClassFormBaseComponent {
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly store: Store<NotificationCreateState>
  ) {
    super(fb, store);
  }
}
