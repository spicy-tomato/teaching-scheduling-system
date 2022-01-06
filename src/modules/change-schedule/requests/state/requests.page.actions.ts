import { createAction, props } from '@ngrx/store';
import {
  ChangeScheduleOptionsParam,
  ChangeScheduleSearch,
} from '@shared/models';

export const reset = createAction('[Change schedule - Requests Page] Reset');

export const load = createAction(
  '[Change schedule - Requests Page] Load',
  props<{ query: ChangeScheduleSearch }>()
);

export const changeOptions = createAction(
  '[Change schedule - Requests Page] Change options',
  props<{ options: ChangeScheduleOptionsParam }>()
);

export const accept = createAction(
  '[Change schedule - Requests Page] Accept',
  props<{ id: number }>()
);

export const deny = createAction(
  '[Change schedule - Requests Page] Deny',
  props<{ id: number }>()
);

export const changePage = createAction(
  '[Change schedule - Requests Page] Change page',
  props<{ page: number }>()
);
