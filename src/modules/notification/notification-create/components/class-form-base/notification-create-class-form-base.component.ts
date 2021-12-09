import { Directive, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Store } from '@ngrx/store';
import { filter, take, takeUntil, tap } from 'rxjs/operators';

import { SubFormBase } from '@modules/core/base/sub-form.base';
import { ICanDeactivateComponent } from '@modules/core/base/can-deactivate.base';
import { NotificationCreateClassModel } from '@models/notification/notification-create/notification-create-class.model';
import { EApiStatus } from 'src/shared/enums/api-status.enum';
import { NotificationCreateShellComponent } from '../../shell/notification-create-shell.component';
import * as fromNotificationCreate from '../../state';

@Directive()
export abstract class NotificationCreateClassFormBaseComponent
  extends SubFormBase<NotificationCreateClassModel>
  implements ICanDeactivateComponent
{
  //#region DECORATORS
  @ViewChild(NotificationCreateShellComponent, { static: false })
  protected shell!: NotificationCreateShellComponent;
  //#endregion

  //#region PRIVATE PROPERTIES
  private _canDeactivate = true;
  //#endregion

  //#region CONSTRUCTOR
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly store: Store<fromNotificationCreate.NotificationCreateState>
  ) {
    super(fb);
    this.handleFormStatusChange();
    this.handleInvalidForm();
  }
  //#endregion

  //#region IMPLEMENTATIONS
  public canDeactivate(): boolean | null {
    if (this.shell.form.pristine) {
      return true;
    }

    return this._canDeactivate || null;
  }

  protected beforeDestroy(): void {
    this.store.dispatch(fromNotificationCreate.reset());
  }
  //#endregion

  //#region PRIVATE HANDLE METHODS
  private handleFormStatusChange(): void {
    this.store
      .select(fromNotificationCreate.selectStatus)
      .pipe(
        tap(
          (status) => (this._canDeactivate = status === EApiStatus.successful)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleInvalidForm(): void {
    this.store
      .select(fromNotificationCreate.selectErrors)
      .pipe(
        filter((errors) => !!errors.receipt),
        take(1),
        tap(() => {
          this.form.markAllAsTouched();
          this.form.markAsDirty();
        })
      )
      .subscribe();
  }
  //#endregion
}
