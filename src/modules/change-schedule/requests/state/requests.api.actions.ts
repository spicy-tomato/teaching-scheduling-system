import { createAction, props } from '@ngrx/store';
import { ChangeScheduleResponse } from '@shared/models';

export const loadSuccessful = createAction(
  '[Change schedule - Requests API] Load Successfully',
  props<{ changeSchedulesResponse: ChangeScheduleResponse }>()
);

export const loadFailure = createAction(
  '[Change schedule - Requests API] Load Failed'
);

export const acceptSuccessful = createAction(
  '[Change schedule - Requests API] Accept Successfully',
  props<{ id: number; status: number }>()
);

export const acceptFailure = createAction(
  '[Change schedule - Requests API] Accept Failed'
);

export const denySuccessful = createAction(
  '[Change schedule - Requests API] Deny Successfully',
  props<{ id: number; status: number }>()
);

export const denyFailure = createAction(
  '[Change schedule - Requests API] Deny Failed'
);
