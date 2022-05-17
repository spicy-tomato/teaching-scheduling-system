import { createAction, props } from '@ngrx/store';
import { AcademicYear, Teacher } from 'src/shared/models';

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
  props<{ academicYears: AcademicYear[] }>()
);

export const loadAcademicYearFailure = createAction(
  '[App Shell API] Load academic year Failed'
);
