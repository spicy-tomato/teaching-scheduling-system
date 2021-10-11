import { FormBuilder, FormControl, ValidationErrors } from '@angular/forms';
import { NotificationCreateClassModel } from '@models/notification/notification-create/notification-create-class.model';
import { SubFormBase } from '@modules/base/sub-form.base';

export class NotificationCreateClassFormBaseComponent extends SubFormBase<NotificationCreateClassModel> {
  constructor(protected fb: FormBuilder) {
    super(fb);
  }

  protected initForm(): void {
    this.form = this.fb.group({
      receipt: new FormControl()
    });
  }
}
