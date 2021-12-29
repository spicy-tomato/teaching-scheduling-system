import { LoginForm } from '@models/login/login-form.model';
import { createAction, props } from '@ngrx/store';

export const reset = createAction('[Login Page] Reset');

export const clickLogin = createAction(
  '[Login Page] Click login',
  props<{ loginForm: LoginForm }>()
);
