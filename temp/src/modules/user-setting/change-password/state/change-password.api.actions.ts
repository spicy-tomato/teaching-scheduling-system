import { createAction } from '@ngrx/store';

export const changeSuccessful = createAction(
  '[Change password API] Change Successfully'
);

export const changeFailure = createAction(
  '[Change password API] Change Failed'
);
