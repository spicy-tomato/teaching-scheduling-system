import { createAction, props } from '@ngrx/store';
import {
  RequestChangeSchedulePayload,
  RequestIntendChangeSchedulePayload,
  Note,
  SearchSchedule,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { TeachingDialogChange } from '.';

export const teachingDialogReset = createAction(
  '[Study Editor Dialog Page] Reset',
  props<{ change: TeachingDialogChange }>()
);

export const teachingDialogRequest = createAction(
  '[Study Editor Dialog Page] Request',
  props<{ body: RequestChangeSchedulePayload }>()
);

export const teachingDialogRequestIntend = createAction(
  '[Study Editor Dialog Page] Request intend',
  props<{ body: RequestIntendChangeSchedulePayload }>()
);

export const teachingDialogChange = createAction(
  '[Study Editor Dialog Page] Change',
  props<{ body: RequestChangeSchedulePayload }>()
);

export const teachingDialogUpdate = createAction(
  '[Study Editor Dialog Page] Update',
  props<{ id: number; body: Note }>()
);

export const teachingDialogSearch = createAction(
  '[Study Editor Dialog Page] Search',
  props<{ params: SearchSchedule; teacherId: string }>()
);

export const teachingDialogCancel = createAction(
  '[Study Editor Dialog Page] Cancel',
  props<{ id: number }>()
);

export const teachingDialogToggleRequestChange = createAction(
  '[Study Editor Dialog Page] Toggle Request Change',
  props<{ open: boolean }>()
);
