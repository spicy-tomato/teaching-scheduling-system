import { createAction, props } from '@ngrx/store';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  SearchAssignSchedule,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';

export const teachingScheduleAssign_Reset = createAction(
  '[Assign Schedule Page] Reset'
);

export const teachingScheduleAssign_LoadFilter = createAction(
  '[Assign Schedule Page] Load filter'
);

export const teachingScheduleAssign_LoadDepartment = createAction(
  '[Assign Schedule Page] Load academic year'
);

export const teachingScheduleAssign_Filter = createAction(
  '[Assign Schedule Page] Filter',
  props<{ dep: string; params: SearchAssignSchedule }>()
);

export const teachingScheduleAssign_ChangeSelectingTeacher = createAction(
  '[Assign Schedule Page] Change selecting teacher',
  props<{ teacher: Nullable<SimpleModel> }>()
);

export const teachingScheduleAssign_ChangeSelected = createAction(
  '[Assign Schedule Page] Selected assigned change',
  props<{ classIds: string[]; checked: boolean }>()
);

export const teachingScheduleAssign_Assign = createAction(
  '[Assign Schedule Page] Assign'
);

export const teachingScheduleAssign_Unassign = createAction(
  '[Assign Schedule Page] Unassign'
);
