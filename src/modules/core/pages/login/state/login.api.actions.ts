import { createAction, props } from '@ngrx/store';
import { Teacher } from 'src/shared/models';

export const loginSuccessful = createAction(
  '[Login API] Login Successfully',
  props<{ teacher: Teacher }>()
);

export const wrongPassword = createAction(
  '[Login API] Login Failed: Wrong password'
);

export const systemError = createAction(
  '[Login API] Login Failed: System error'
);
