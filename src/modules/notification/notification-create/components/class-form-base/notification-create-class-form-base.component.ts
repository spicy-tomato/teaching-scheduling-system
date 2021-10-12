import { Directive, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { NotificationCreateClassModel } from '@models/notification/notification-create/notification-create-class.model';
import { ICanDeactivateComponent } from '@modules/base/can-deactivate.base';
import { SubFormBase } from '@modules/base/sub-form.base';
import { NotificationCreateShellComponent } from '../../shell/notification-create-shell.component';

@Directive()
export class NotificationCreateClassFormBaseComponent extends SubFormBase<NotificationCreateClassModel> implements ICanDeactivateComponent {
  @ViewChild(NotificationCreateShellComponent, { static: true })
  protected shell!: NotificationCreateShellComponent;

  constructor(protected fb: FormBuilder) {
    super(fb);
  }

  protected initForm(): void {
    this.form = this.fb.group({
      receipt: new FormControl()
    });
  }

  public canDeactivate(): boolean | null {
    if (this.shell.form.pristine) {
      return true;
    }

    return null;
  }
}
