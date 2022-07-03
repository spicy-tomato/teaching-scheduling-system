import { createAction, props } from '@ngrx/store';
import {
  ChangeSchedule,
  ChangeScheduleOptionsParam,
  ChangeScheduleSearch,
} from '@teaching-scheduling-system/web/shared/data-access/models';

export const teachingScheduleRequestReset = createAction(
  '[Change schedule - Requests Page] Reset',
  props<{ personal: boolean }>()
);

export const teachingScheduleRequestFilter = createAction(
  '[Change schedule - Requests Page] Filter',
  props<{ query: ChangeScheduleSearch }>()
);

export const teachingScheduleRequestChangeOptions = createAction(
  '[Change schedule - Requests Page] Change options',
  props<{ options: ChangeScheduleOptionsParam }>()
);

export const teachingScheduleRequestAccept = createAction(
  '[Change schedule - Requests Page] Accept',
  props<{ schedule: ChangeSchedule }>()
);

export const teachingScheduleRequestSetRoom = createAction(
  '[Change schedule - Requests Page] Set room',
  props<{ schedule: ChangeSchedule; newIdRoom: string }>()
);

export const teachingScheduleRequestDeny = createAction(
  '[Change schedule - Requests Page] Deny',
  props<{ schedule: ChangeSchedule; reason: string }>()
);

export const teachingScheduleRequestCancel = createAction(
  '[Change schedule - Requests Page] Cancel',
  props<{ id: number }>()
);

export const teachingScheduleRequestChangePage = createAction(
  '[Change schedule - Requests Page] Change page',
  props<{ page: number }>()
);

export const teachingScheduleRequestChangeSelectExport = createAction(
  '[Change schedule - Requests Page] Change select export',
  props<{ selectExport: boolean[] }>()
);
