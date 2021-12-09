import { Teacher } from '@models/core/teacher.model';
import { createAction, props } from '@ngrx/store';

export const autoLoginSuccessfully = createAction(
  '[App Shell API] Auto login Successfully',
  props<{ teacher: Teacher }>()
);

export const autoLoginFailure = createAction(
  '[App Shell API] Auto login Failed'
);
