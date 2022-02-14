import { createAction, props } from '@ngrx/store';
import { SimpleFixedScheduleModel } from '@shared/models';
import { Change } from '.';

export const requestSuccessful = createAction(
  '[Study Editor Dialog API] Request Successfully',
  props<{ justRequestedSchedule: SimpleFixedScheduleModel }>()
);

export const updateSuccessful = createAction(
  '[Study Editor Dialog API] Update Successfully',
  props<{ change: Change }>()
);

export const requestFailure = createAction(
  '[Study Editor Dialog API] Request Failed'
);

export const updateFailure = createAction(
  '[Study Editor Dialog API] Update Failed'
);
