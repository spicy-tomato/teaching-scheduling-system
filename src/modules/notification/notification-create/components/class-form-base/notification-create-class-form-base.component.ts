import { Directive, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { Store } from '@ngrx/store';
import { takeUntil, tap } from 'rxjs/operators';

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

  @ViewChild(NotificationCreateShellComponent, { static: true })
  protected shell!: NotificationCreateShellComponent;

  private _canDeactivate = true;

  constructor(
    protected readonly fb: FormBuilder,
    protected readonly store: Store<fromNotificationCreate.NotificationCreateState>
  ) {
    super(fb);
    this.handleFormStatusChange();
  }

  protected beforeDestroy(): void {
    this.store.dispatch(fromNotificationCreate.reset());
  }

  protected initForm(): void {
    this.form = this.fb.group({
      receipt: new FormControl()
    });
  }

  private handleFormStatusChange(): void {
    this.store.select(fromNotificationCreate.selectStatus)
      .pipe(
        tap(status => this._canDeactivate = status === EApiStatus.successful),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public canDeactivate(): boolean | null {
    if (this.shell.form.pristine) {
      return true;
    }

    return this._canDeactivate || null;
  }
}
