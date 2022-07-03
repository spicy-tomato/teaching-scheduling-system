import { createAction, props } from '@ngrx/store';
import { LoginForm } from '@teaching-scheduling-system/web/shared/data-access/models';

export const reset = createAction('[Login Page] Reset');

export const clickLogin = createAction(
  '[Login Page] Click login',
  props<{ loginForm: LoginForm }>()
);
