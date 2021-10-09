/* eslint-disable @typescript-eslint/unbound-method */
import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { FormBuilder, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { NotificationCreateCommonFormModel } from '@models/notification/notification-create/notification-create-common-form.model';
import { SubFormBase } from '@modules/base/sub-form.base';

@Component({
  selector: 'tss-notification-create-common-form',
  templateUrl: './notification-create-common-form.component.html',
  styleUrls: ['./notification-create-common-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NotificationCreateCommonFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NotificationCreateCommonFormComponent),
      multi: true
    }
  ]
})
export class NotificationCreateCommonFormComponent extends SubFormBase<NotificationCreateCommonFormModel> {
  public readonly types = [
    'Học tập',
    'Học phí',
    'Ngoại khóa',
    'Chi trả xã hội',
  ];

  constructor(protected fb: FormBuilder) {
    super(fb);
  }

  protected initForm(): void {
    this.form = this.fb.group({
      title: new FormControl('', Validators.required),
      type: new FormControl(null, Validators.required),
      body: new FormControl('', Validators.required),
      date: new FormControl()
    });
  }

  public validate(): ValidationErrors | null {
    return null;
  }
}
