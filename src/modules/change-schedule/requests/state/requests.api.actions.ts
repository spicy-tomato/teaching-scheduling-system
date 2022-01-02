import { createAction, props } from '@ngrx/store';
import { ChangeScheduleResponse } from '@shared/models';

export const loadSuccessful = createAction(
  '[Change schedule - Requests API] Load Successfully',
  props<{ changeSchedulesResponse: ChangeScheduleResponse }>()
);

export const loadFailure = createAction(
  '[Change schedule - Requests API] Load Failed'
);
