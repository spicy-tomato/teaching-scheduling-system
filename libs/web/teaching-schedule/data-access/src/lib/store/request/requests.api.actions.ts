import { createAction, props } from '@ngrx/store';
import { RequestChangeScheduleCode } from '@teaching-scheduling-system/core/data-access/models';
import {
  ChangeSchedule,
  PaginationResponseModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';

export const filterSuccessful = createAction(
  '[Change schedule - Requests API] Filter Successfully',
  props<{
    changeSchedulesResponse: PaginationResponseModel<ChangeSchedule[]>;
  }>()
);

export const filterFailure = createAction(
  '[Change schedule - Requests API] Filter Failed'
);

export const acceptSuccessful = createAction(
  '[Change schedule - Requests API] Accept Successfully',
  props<{ id: number; status: RequestChangeScheduleCode }>()
);

export const acceptFailure = createAction(
  '[Change schedule - Requests API] Accept Failed'
);

export const setRoomSuccessful = createAction(
  '[Change schedule - Requests API] Set Room Successfully',
  props<{ id: number; room: string }>()
);

export const setRoomFailure = createAction(
  '[Change schedule - Requests API] Set Room Failed'
);

export const denySuccessful = createAction(
  '[Change schedule - Requests API] Deny Successfully',
  props<{ id: number; status: RequestChangeScheduleCode }>()
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
