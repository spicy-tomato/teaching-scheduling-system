import { FormGroup } from "@angular/forms";
import { createAction, props } from "@ngrx/store";

export const clickConfirm = createAction(
  '[Notification - Create Page] Click confirm',
  props<{ form: FormGroup; }>()
);
