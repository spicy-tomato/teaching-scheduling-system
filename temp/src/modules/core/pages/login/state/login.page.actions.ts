import { createAction, props } from '@ngrx/store';
import { LoginForm } from 'src/shared/models';

export const reset = createAction('[Login Page] Reset');

export const clickLogin = createAction(
  '[Login Page] Click login',
  props<{ loginForm: LoginForm }>()
);
