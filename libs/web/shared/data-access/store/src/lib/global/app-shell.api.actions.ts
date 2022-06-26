import { createAction, props } from '@ngrx/store';
import {
  AcademicData,
  BreadcrumbItem,
  SimpleModel,
  Teacher,
} from '@teaching-scheduling-system/web/shared/data-access/models';

export const updateBreadcrumbs = createAction(
  '[App Shell API] Update breadcrumbs',
  props<{ breadcrumbs: BreadcrumbItem[] }>()
);

export const autoLoginSuccessfully = createAction(
  '[App Shell API] Auto login Successfully',
  props<{ teacher: Teacher }>()
);

export const autoLoginFailure = createAction(
  '[App Shell API] Auto login Failed'
);

export const loadRoomsSuccessfully = createAction(
  '[App Shell API] Load rooms Successfully',
  props<{ rooms: string[] }>()
);

export const loadRoomsFailure = createAction(
  '[App Shell API] Load rooms Failed'
);

export const loadCurrentTermSuccessful = createAction(
  '[App Shell API] Load current term Successfully',
  props<{ currentTerm: string }>()
);

export const loadCurrentTermFailure = createAction(
  '[App Shell API] Load current term Failed'
);

export const loadAcademicYearSuccessful = createAction(
  '[App Shell API] Load academic year Successfully',
  props<{ academicYears: AcademicData[] }>()
);

export const loadAcademicYearFailure = createAction(
  '[App Shell API] Load academic year Failed'
);

export const loadTeachersInDepartmentSuccessful = createAction(
  '[App Shell API] Load teachers in department Successfully',
  props<{ teachers: SimpleModel[] }>()
);

export const loadTeachersInDepartmentFailure = createAction(
  '[App Shell API] Load teachers in department Failed'
);
