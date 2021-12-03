import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { NotificationCreateCommonFormModel } from '@models/notification/notification-create/notification-create-common-form.model';
import { SubFormBase } from '@modules/core/base/sub-form.base';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';
import { EApiStatus } from 'src/enums/api-status.enum';
import * as fromNotificationCreate from '../../state';

@Component({
  selector: 'tss-notification-create-common-form',
  templateUrl: './notification-create-common-form.component.html',
  styleUrls: ['./notification-create-common-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NotificationCreateCommonFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NotificationCreateCommonFormComponent),
      multi: true,
    },
  ],
})
export class NotificationCreateCommonFormComponent extends SubFormBase<NotificationCreateCommonFormModel> {
  public readonly types = [
    'Học tập',
    'Học phí',
    'Ngoại khóa',
    'Chi trả xã hội',
  ];

  constructor(
    protected readonly fb: FormBuilder,
    private readonly store: Store<fromNotificationCreate.NotificationCreateState>
  ) {
    super(fb);

    this.handleSubmitSuccessful();
    this.handleInvalidForm();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      title: new FormControl('', Validators.required),
      type: new FormControl(null, Validators.required),
      body: new FormControl('', Validators.required),
      date: new FormControl(),
    });
  }

  private handleInvalidForm(): void {
    this.store
      .select(fromNotificationCreate.selectErrors)
      .pipe(
        filter((errors) => !!errors.content),
        take(1),
        tap(() => {
          this.form.markAllAsTouched();
          this.form.markAsDirty();
        })
      )
      .subscribe();
  }

  private handleSubmitSuccessful(): void {
    this.store
      .select(fromNotificationCreate.selectStatus)
      .pipe(filter((status) => status === EApiStatus.successful));
  }
}
