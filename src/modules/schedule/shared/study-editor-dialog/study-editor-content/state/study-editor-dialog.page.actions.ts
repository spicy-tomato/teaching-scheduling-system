import { createAction, props } from '@ngrx/store';
import {
  Note,
  RequestChangeSchedulePayload,
  RequestIntendChangeSchedulePayload,
  SearchSchedule,
} from 'src/shared/models';
import { Change } from '.';

export const reset = createAction(
  '[Study Editor Dialog Page] Reset',
  props<{ change: Change }>()
);

export const request = createAction(
  '[Study Editor Dialog Page] Request',
  props<{ body: RequestChangeSchedulePayload }>()
);

export const requestIntend = createAction(
  '[Study Editor Dialog Page] Request intend',
  props<{ body: RequestIntendChangeSchedulePayload }>()
);

export const change = createAction(
  '[Study Editor Dialog Page] Change',
  props<{ body: RequestChangeSchedulePayload }>()
);

export const update = createAction(
  '[Study Editor Dialog Page] Update',
  props<{ id: number; body: Note }>()
);

export const search = createAction(
  '[Study Editor Dialog Page] Search',
  props<{ params: SearchSchedule; teacherId: string }>()
);

export const cancel = createAction(
  '[Study Editor Dialog Page] Cancel',
  props<{ id: number }>()
);

export const toggleRequestChange = createAction(
  '[Study Editor Dialog Page] Toggle Request Change',
  props<{ open: boolean }>()
);
