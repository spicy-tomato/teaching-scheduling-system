import { createAction, props } from '@ngrx/store';
import { SimpleFixedScheduleModel, StudyScheduleModel } from '@shared/models';
import { Change } from '.';

export const requestSuccessful = createAction(
  '[Study Editor Dialog API] Request Successfully',
  props<{ justRequestedSchedule: SimpleFixedScheduleModel }>()
);

export const requestFailure = createAction(
  '[Study Editor Dialog API] Request Failed'
);

export const updateSuccessful = createAction(
  '[Study Editor Dialog API] Update Successfully',
  props<{ change: Change }>()
);

export const updateFailure = createAction(
  '[Study Editor Dialog API] Update Failed'
);

export const searchSuccessful = createAction(
  '[Study Editor Dialog API] Search Successfully',
  props<{
    searchSchedule: StudyScheduleModel[];
  }>()
);

export const searchFailure = createAction(
  '[Study Editor Dialog API] Search Failed'
);
