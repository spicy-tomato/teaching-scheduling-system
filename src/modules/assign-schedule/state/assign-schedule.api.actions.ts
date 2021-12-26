import { ModuleClass } from '@models/class/module-class.model';
import { AcademicYear } from '@models/core/academic-year.model';
import { SimpleModel } from '@models/core/simple.model';
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

export const loadTeacherSuccessful = createAction(
  '[Assign Schedule API] Load Teacher Successfully',
  props<{ teachers: SimpleModel[] }>()
);

export const loadTeacherFailure = createAction(
  '[Assign Schedule API] Load Teacher Failed'
);
