/* eslint-disable @typescript-eslint/unbound-method */
import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, filter, mergeMap, take, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '@modules/base/base.component';
import isEmpty from 'lodash/isEmpty';

import * as fromNotificationCreate from '../state';
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

  public readonly form = this.fb.group({
    content: new FormControl(),
    receipt: new FormControl()
  });

  private showedError = false;

  public readonly confirm$ = new Subject<void>();

  private get content(): AbstractControl | null {
    return this.form.get('content');
  }

  private get receipt(): AbstractControl | null {
    return this.form.get('receipt');
  }

  constructor(
    private readonly fb: FormBuilder,
    private store: Store<fromNotificationCreate.NotificationCreateState>,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(TuiNotificationsService) private readonly notificationsService: TuiNotificationsService
  ) {
    super();
    this.handleSubmit();
    this.handleValidForm();
    this.handleInvalidForm();
  }

  private handleSubmit(): void {
    this.confirm$
      .pipe(
        debounceTime(300),
        tap(() => {
          const form = this.form;
          this.store.dispatch(fromNotificationCreate.clickConfirm({ form }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleValidForm(): void {

    // this.validForm$
    //   .pipe(
    //     tap(() => {
    //       this.content?.disable();
    //     }),
    //     mergeMap(() =>
    //       this.dialogService.open(this.successDialog)
    //     ),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe();
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
