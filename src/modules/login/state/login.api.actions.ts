import { createAction, props } from "@ngrx/store";

export const loginSuccessful = createAction(
  '[Login API] Login Successfully',
  props<{
    name: string;
  }>()
);

export const loginFailure = createAction('[Login API] Login Failed');
