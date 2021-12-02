import { Teacher } from '@models/core/teacher.model';
import { createAction, props } from '@ngrx/store';

export const loginSuccessful = createAction(
  '[Login API] Login Successfully',
  props<{ teacher: Teacher }>()
);

export const loginFailure = createAction('[Login API] Login Failed');
