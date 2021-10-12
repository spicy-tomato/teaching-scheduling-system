/* eslint-disable @typescript-eslint/unbound-method */
import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NotificationCreateState } from '../../state/notification-create.state';
import { NotificationCreateClassFormBaseComponent } from '../class-form-base/notification-create-class-form-base.component';

@Component({
  selector: 'tss-notification-create-managing-class',
  templateUrl: './notification-create-managing-class.component.html',
  styleUrls: ['./notification-create-managing-class.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NotificationCreateManagingClassComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NotificationCreateManagingClassComponent),
      multi: true
    }
  ]
})
export class NotificationCreateManagingClassComponent extends NotificationCreateClassFormBaseComponent {
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly store: Store<NotificationCreateState>
  ) {
    super(fb, store);
  }
}
