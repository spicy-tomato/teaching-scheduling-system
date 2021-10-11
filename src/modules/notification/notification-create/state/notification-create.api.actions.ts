import { ValidationErrors } from "@angular/forms";
import { createAction, props } from "@ngrx/store";

export const validForm = createAction(
  '[Notification - Create Page] Invalid form',
  props<{
    errors: {
      [key: string]: ValidationErrors;
    };
  }>()
);

export const invalidForm = createAction(
  '[Notification - Create Page] Invalid form',
  props<{
    errors: {
      [key: string]: ValidationErrors;
    };
  }>()
);

