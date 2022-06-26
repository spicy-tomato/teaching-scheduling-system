import { createAction, props } from '@ngrx/store';
import {
  ModuleClass,
  SimpleMapModel,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';

export const loadDepartmentSuccessful = createAction(
  '[Assign Schedule API] Load department year Successfully',
  props<{ departments: SimpleMapModel<string, SimpleModel[]>[] }>()
);

export const loadDepartmentFailure = createAction(
  '[Assign Schedule API] Load department year Failed'
);

export const filterSuccessful = createAction(
  '[Assign Schedule API] Filter Successfully',
  props<{ classes: ModuleClass[] }>()
);

export const filterFailure = createAction(
  '[Assign Schedule API] Filter Failed'
);

export const loadTeacherSuccessful = createAction(
  '[Assign Schedule API] Load Teacher Successfully',
  props<{ teachers: SimpleModel[] }>()
);

export const loadTeacherFailure = createAction(
  '[Assign Schedule API] Load Teacher Failed'
);

export const assignSuccessful = createAction(
  '[Assign Schedule API] Assign Successfully',
  props<{ teacher: SimpleModel }>()
);

export const assignFailure = createAction(
  '[Assign Schedule API] Assign Failed'
);

export const unassignSuccessful = createAction(
  '[Assign Schedule API] Unassign Successfully'
);

export const unassignFailure = createAction(
  '[Assign Schedule API] Unassign Failed'
);
