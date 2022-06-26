import { createAction, props } from '@ngrx/store';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  SearchAssignSchedule,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';

export const teachingScheduleAssignReset = createAction(
  '[Assign Schedule Page] Reset'
);

export const teachingScheduleAssignLoadFilter = createAction(
  '[Assign Schedule Page] Load filter'
);

export const teachingScheduleAssignLoadDepartment = createAction(
  '[Assign Schedule Page] Load academic year'
);

export const teachingScheduleAssignFilter = createAction(
  '[Assign Schedule Page] Filter',
  props<{ dep: string; params: SearchAssignSchedule }>()
);

export const teachingScheduleAssignChangeSelectingTeacher = createAction(
  '[Assign Schedule Page] Change selecting teacher',
  props<{ teacher: Nullable<SimpleModel> }>()
);

export const teachingScheduleAssignSelectedAssignedChange = createAction(
  '[Assign Schedule Page] Selected assigned change',
  props<{ checkbox: boolean[] }>()
);

export const teachingScheduleAssignSelectedNeedAssignChange = createAction(
  '[Assign Schedule Page] Selected need assign change',
  props<{ checkbox: boolean[] }>()
);

export const teachingScheduleAssignAssign = createAction(
  '[Assign Schedule Page] Assign',
  props<{ teacher: SimpleModel; classIds: string[] }>()
);

export const teachingScheduleAssignUnassign = createAction(
  '[Assign Schedule Page] Unassign',
  props<{ classIds: string[] }>()
);
