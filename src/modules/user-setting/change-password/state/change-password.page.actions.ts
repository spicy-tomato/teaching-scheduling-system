import { createAction, props } from '@ngrx/store';
import { ChangePassword } from 'src/shared/models';

export const change = createAction(
  '[Change password Page] Change',
  props<{ form: ChangePassword }>()
);

export const reset = createAction('[Change password Page] Reset');
