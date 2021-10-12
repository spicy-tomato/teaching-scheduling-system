import { ErrorMapModel } from "@models/core/error-map.model";
import { createAction, props } from "@ngrx/store";

export const invalidForm = createAction(
  '[Notification - Create API] Invalid form',
  props<{ errors: ErrorMapModel; }>()
);

export const submitSuccessful = createAction(
  '[Notification - Create API] Submit Successfully'
);

export const submitFailure = createAction(
  '[Notification - Create API] Submit Failed'
);

