import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

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
export class NotificationCreateShellComponent extends BaseComponent implements OnInit {
  //#region Decorators
  @Input() public receipt!: FormGroup;
  @Input() public isButtonLoading!: boolean;
  @ViewChild('successDialog', { static: true }) public successDialog!: PolymorpheusContent<TuiDialogContext>;
  //#endregion


  //#region Public properties
  public form!: FormGroup;

  public status$: Observable<EApiStatus>;
  public readonly reset$ = new Subject<void>();
  public readonly confirm$ = new Subject<void>();
  //#endregion


  //#region Getters
  public get ConfirmStatus(): typeof EApiStatus {
    return EApiStatus;
  }
  //#endregion


  //#region Constructor
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<fromNotificationCreate.NotificationCreateState>,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(TuiNotificationsService) private readonly notificationsService: TuiNotificationsService,
  ) {
    super();

    this.status$ = this.store
      .select(fromNotificationCreate.selectStatus)
      .pipe(
        takeUntil(this.destroy$)
      );
  }
  //#endregion


  //#region Lifecycle Hooks
  public ngOnInit(): void {
    this.form = this.fb.group({
      content: new FormControl(),
      receipt: this.receipt.get('receipt')
    });

    this.handleStatusChange();
    this.handleSubmit();
    this.handleResetForm();
    this.handleValidForm();
    this.handleInvalidForm();
  }
  //#endregion

  //#region Private handle methods
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

  private handleResetForm(): void {
    this.reset$
      .pipe(
        tap(() => {
          this.form.reset();
          this.store.dispatch(fromNotificationCreate.reset());
        })
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
  //#endregion
}
