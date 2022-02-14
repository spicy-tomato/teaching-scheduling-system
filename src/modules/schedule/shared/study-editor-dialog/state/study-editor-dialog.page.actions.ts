import { createAction, props } from '@ngrx/store';
import { Note, RequestChangeSchedulePayload } from 'src/shared/models';
import { Change } from '.';

export const reset = createAction(
  '[Study Editor Dialog Page] Reset',
  props<{ change: Change }>()
);

export const request = createAction(
  '[Study Editor Dialog Page] Request',
  props<{ body: RequestChangeSchedulePayload }>()
);

export const update = createAction(
  '[Study Editor Dialog Page] Update',
  props<{ body: Note }>()
);

export const toggleRequestChange = createAction(
  '[Study Editor Dialog Page] Toggle Request Change',
  props<{ open: boolean }>()
);
