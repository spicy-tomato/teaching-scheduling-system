import { createAction, props } from '@ngrx/store';
import { Nullable, SearchSchedule, SimpleModel } from 'src/shared/models';

export const reset = createAction('[Assign Schedule Page] Reset');

export const loadFilter = createAction('[Assign Schedule Page] Load filter');

export const loadSchoolYear = createAction(
  '[Assign Schedule Page] Load school year'
);

export const loadAcademicYear = createAction(
  '[Assign Schedule Page] Load academic year'
);

export const loadDepartment = createAction(
  '[Assign Schedule Page] Load academic year'
);

export const filter = createAction(
  '[Assign Schedule Page] Filter',
  props<{ dep: string; params: SearchSchedule }>()
);

export const changeSelectingTeacher = createAction(
  '[Assign Schedule Page] Change selecting teacher',
  props<{ teacher: Nullable<SimpleModel> }>()
);

export const selectedAssignedChange = createAction(
  '[Assign Schedule Page] Selected assigned change',
  props<{ checkbox: boolean[] }>()
);

export const selectedNeedAssignChange = createAction(
  '[Assign Schedule Page] Selected need assign change',
  props<{ checkbox: boolean[] }>()
);

export const assign = createAction(
  '[Assign Schedule Page] Assign',
  props<{ teacher: SimpleModel; classIds: string[] }>()
);

export const unassign = createAction(
  '[Assign Schedule Page] Unassign',
  props<{ classIds: string[] }>()
);
