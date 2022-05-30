import { createAction, props } from '@ngrx/store';
import {
  ChangeSchedule,
  ChangeScheduleOptionsParam,
  ChangeScheduleSearch,
} from '@shared/models';

export const reset = createAction(
  '[Change schedule - Requests Page] Reset',
  props<{ personal: boolean }>()
);

export const filter = createAction(
  '[Change schedule - Requests Page] Filter',
  props<{ query: ChangeScheduleSearch }>()
);

export const loadTeachersList = createAction(
  '[Change schedule - Requests Page] Load teachers list',
  props<{ dep: string }>()
);

export const changeOptions = createAction(
  '[Change schedule - Requests Page] Change options',
  props<{ options: ChangeScheduleOptionsParam }>()
);

export const accept = createAction(
  '[Change schedule - Requests Page] Accept',
  props<{ schedule: ChangeSchedule }>()
);

export const setRoom = createAction(
  '[Change schedule - Requests Page] Set room',
  props<{ schedule: ChangeSchedule; newIdRoom: string }>()
);

export const deny = createAction(
  '[Change schedule - Requests Page] Deny',
  props<{ schedule: ChangeSchedule; reason: string }>()
);

export const cancel = createAction(
  '[Change schedule - Requests Page] Cancel',
  props<{ id: number }>()
);

export const changePage = createAction(
  '[Change schedule - Requests Page] Change page',
  props<{ page: number }>()
);

export const changeSelectExport = createAction(
  '[Change schedule - Requests Page] Change select export',
  props<{ selectExport: boolean[] }>()
);
