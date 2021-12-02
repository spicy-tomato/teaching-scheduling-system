import { LoginForm } from "@models/login/login-form.model";
import { createAction, props } from "@ngrx/store";

export const clickLogin = createAction(
  '[Login Page] Click login',
  props<{
    loginForm: LoginForm;
  }>()
);
