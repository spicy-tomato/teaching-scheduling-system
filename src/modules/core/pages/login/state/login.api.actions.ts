import { Teacher } from '@models/core/teacher.model';
import { createAction, props } from '@ngrx/store';

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
