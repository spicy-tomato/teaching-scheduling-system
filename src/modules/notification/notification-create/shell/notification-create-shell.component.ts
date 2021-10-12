/* eslint-disable @typescript-eslint/unbound-method */
import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '@modules/base/base.component';
import isEmpty from 'lodash/isEmpty';

import { NotificationCreateFormModel } from '@models/notification/notification-create/notification-create-form.model';
import * as fromNotificationCreate from '../state';
import { EApiStatus } from 'src/enums/api-status.enum';

import { TuiDialogContext, TuiDialogService, TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { PolymorpheusContent } from "@tinkoff/ng-polymorpheus";

@Component({
  selector: 'tss-notification-create-shell',
  templateUrl: './notification-create-shell.component.html',
  styleUrls: ['./notification-create-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationCreateShellComponent extends BaseComponent {
  @ViewChild('successDialog', { static: true }) public successDialog!: PolymorpheusContent<TuiDialogContext>;

  public form = this.fb.group({
    content: new FormControl(),
    receipt: new FormControl()
  });

  public status$: Observable<EApiStatus>;
  public readonly confirm$ = new Subject<void>();

  public get ConfirmStatus(): typeof EApiStatus {
    return EApiStatus;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<fromNotificationCreate.NotificationCreateState>,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(TuiNotificationsService) private readonly notificationsService: TuiNotificationsService
  ) {
    super();

    this.status$ = this.store
      .select(fromNotificationCreate.selectStatus)
      .pipe(
        takeUntil(this.destroy$)
      );

    this.handleStatusChange();
    this.handleSubmit();
    this.handleValidForm();
    this.handleInvalidForm();
  }

  private handleStatusChange(): void {
    this.status$
      .pipe(
        tap((status) => {
          status === EApiStatus.loading || status === EApiStatus.successful
            ? this.form.disable()
            : this.form.enable();
        })
      )
      .subscribe();
  }

  private handleSubmit(): void {
    this.confirm$
      .pipe(
        debounceTime(300),
        tap(() => {
          const value: NotificationCreateFormModel = this.form.value as NotificationCreateFormModel;

          const errors = Object.keys(this.form.controls)
            .reduce((acc: ValidationErrors, key) => {
              if (this.form.controls[key].errors) {
                acc[key] = this.form.controls[key].errors;
              }
              return acc;
            }, {});

          this.store.dispatch(fromNotificationCreate.clickConfirm({ value, errors }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleValidForm(): void {
    this.status$
      .pipe(
        filter((status) => status === EApiStatus.successful),
        mergeMap(() =>
          this.dialogService.open(this.successDialog)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleInvalidForm(): void {
    this.store.select(fromNotificationCreate.selectErrors)
      .pipe(
        filter((errors) => !isEmpty(errors)),
        mergeMap(() =>
          this.notificationsService
            .show(
              'Hãy thử lại', {
              label: 'Hãy nhập đúng dữ liệu các trường!',
              status: TuiNotification.Error
            })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
