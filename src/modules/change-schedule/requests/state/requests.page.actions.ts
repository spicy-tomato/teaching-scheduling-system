import { createAction, props } from '@ngrx/store';
import { ChangeScheduleSearch } from '@shared/models';

export const reset = createAction('[Change schedule - Requests Page] Reset');

export const load = createAction(
  '[Change schedule - Requests Page] Load',
  props<{ query: ChangeScheduleSearch }>()
);

export const accept = createAction(
  '[Change schedule - Requests Page] Accept',
  props<{ id: number }>()
);

export const deny = createAction(
  '[Change schedule - Requests Page] Deny',
  props<{ id: number }>()
);
