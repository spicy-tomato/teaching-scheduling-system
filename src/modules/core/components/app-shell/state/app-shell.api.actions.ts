import { createAction, props } from '@ngrx/store';
import { Teacher } from 'src/shared/models';

export const autoLoginSuccessfully = createAction(
  '[App Shell API] Auto login Successfully',
  props<{ teacher: Teacher }>()
);

export const autoLoginFailure = createAction(
  '[App Shell API] Auto login Failed'
);
