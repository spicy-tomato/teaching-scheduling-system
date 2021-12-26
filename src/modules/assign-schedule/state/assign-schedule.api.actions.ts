import { ModuleClass } from '@models/class/module-class.model';
import { AcademicYear } from '@models/core/academic-year.model';
import { createAction, props } from '@ngrx/store';

export const loadCurrentTermSuccessful = createAction(
  '[Assign Schedule API] Load current term Successfully',
  props<{ currentTerm: string }>()
);

export const loadCurrentTermFailure = createAction(
  '[Assign Schedule API] Load current term Failed'
);

export const loadAcademicYearSuccessful = createAction(
  '[Assign Schedule API] Load academic year Successfully',
  props<{ academicYears: AcademicYear }>()
);

export const loadAcademicYearFailure = createAction(
  '[Assign Schedule API] Load academic year Failed'
);

export const filterSuccessful = createAction(
  '[Assign Schedule API] Filter Successfully',
  props<{ classes: ModuleClass[] }>()
);

export const filterFailure = createAction(
  '[Assign Schedule API] Filter Failed'
);
