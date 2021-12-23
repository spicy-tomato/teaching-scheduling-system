import { AcademicYear } from '@models/core/academic-year.model';
import { SimpleModel } from '@models/core/simple.model';
import { createAction, props } from '@ngrx/store';

export const loadSchoolYearSuccessful = createAction(
  '[Assign Schedule API] Load school year Successfully',
  props<{ schoolYears: string[] }>()
);

export const loadSchoolYearFailure = createAction(
  '[Assign Schedule API] Load school year Failed'
);

export const loadAcademicYearSuccessful = createAction(
  '[Assign Schedule API] Load academic year Successfully',
  props<{ academicYears: AcademicYear }>()
);

export const loadAcademicYearFailure = createAction(
  '[Assign Schedule API] Load academic year Failed'
);
