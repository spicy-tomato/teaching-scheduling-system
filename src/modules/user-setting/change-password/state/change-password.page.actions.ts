import { ChangePassword } from '@models/user/change-password.model';
import { createAction, props } from '@ngrx/store';

export const change = createAction(
  '[Change password Page] Change',
  props<{ form: ChangePassword }>()
);
