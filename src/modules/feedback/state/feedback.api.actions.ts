import { createAction } from '@ngrx/store';

export const submitSuccessful = createAction(
  '[Feedback API] Submit Successfully'
);

export const submitFailure = createAction('[Feedback API] Submit Failed');
