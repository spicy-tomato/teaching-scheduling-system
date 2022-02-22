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

export const setRoomSuccessful = createAction(
  '[Change schedule - Requests API] Set Room Successfully',
  props<{ id: number; status: number; room: string }>()
);

export const setRoomFailure = createAction(
  '[Change schedule - Requests API] Set Room Failed'
);

export const denySuccessful = createAction(
  '[Change schedule - Requests API] Deny Successfully',
  props<{ id: number; status: number }>()
);

export const denyFailure = createAction(
  '[Change schedule - Requests API] Deny Failed'
);

export const cancelSuccessful = createAction(
  '[Change schedule - Requests API] Cancel Successfully',
  props<{ id: number }>()
);

export const cancelFailure = createAction(
  '[Change schedule - Requests API] Cancel Failed'
);
