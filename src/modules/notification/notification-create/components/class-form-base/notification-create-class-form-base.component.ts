import { Directive, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { filter, take, takeUntil, tap } from 'rxjs/operators';

import { SubFormBase } from '@modules/base/sub-form.base';
import { ICanDeactivateComponent } from '@modules/base/can-deactivate.base';
import { NotificationCreateClassModel } from '@models/notification/notification-create/notification-create-class.model';
import { EApiStatus } from 'src/enums/api-status.enum';
import { NotificationCreateShellComponent } from '../../shell/notification-create-shell.component';
import * as fromNotificationCreate from '../../state';

@Directive()
export abstract class NotificationCreateClassFormBaseComponent
  extends SubFormBase<NotificationCreateClassModel>
  implements ICanDeactivateComponent {

  //#region Decorators
  @ViewChild(NotificationCreateShellComponent, { static: true }) protected shell!: NotificationCreateShellComponent;
  //#endregion


  //#region Private properties
  private _canDeactivate = true;
  //#endregion


  //#region Constructor
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly store: Store<fromNotificationCreate.NotificationCreateState>
  ) {
    super(fb);
    this.handleFormStatusChange();
    this.handleInvalidForm();
  }
  //#endregion


  //#region Implementations
  public canDeactivate(): boolean | null {
    if (this.shell.form.pristine) {
      return true;
    }

    return this._canDeactivate || null;
  }

  protected beforeDestroy(): void {
    this.store.dispatch(fromNotificationCreate.reset());
  }

  protected initForm(): void {
    this.form = this.fb.group({
      receipt: new FormControl([], [Validators.required])
    });
  }
  //#endregion


  //#region Private handle methods
  private handleFormStatusChange(): void {
    this.store.select(fromNotificationCreate.selectStatus)
      .pipe(
        tap(status => this._canDeactivate = status === EApiStatus.successful),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
  
  private handleInvalidForm(): void {
    this.store.select(fromNotificationCreate.selectErrors)
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
