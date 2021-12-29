import { createAction, props } from '@ngrx/store';
import {
  ErrorMapModel,
  AcademicYear,
  Faculty,
  ManagingClass,
} from 'src/shared/models';

export const invalidForm = createAction(
  '[Notification - Create API] Invalid form',
  props<{ errors: ErrorMapModel }>()
);

export const submitSuccessful = createAction(
  '[Notification - Create API] Submit Successfully'
);

export const submitFailure = createAction(
  '[Notification - Create API] Submit Failed'
);

export const loadAcademicYearsSuccessful = createAction(
  '[Notification - Create API: Managing Class] Load Academic years Successfully',
  props<{ academicYears: AcademicYear }>()
);

export const loadAcademicYearsFailure = createAction(
  '[Notification - Create API: Managing Class] Load Academic years Failed'
);

export const loadFacultiesSuccessful = createAction(
  '[Notification - Create API: Managing Class] Load Faculties Successfully',
  props<{ faculties: Faculty[] }>()
);

export const loadFacultiesFailure = createAction(
  '[Notification - Create API: Managing Class] Load Faculties Failed'
);

export const loadManagingClassesSuccessful = createAction(
  '[Notification - Create API: Managing Class] Load classes Successfully',
  props<{ classes: ManagingClass[] }>()
);

export const loadManagingClassesFailure = createAction(
  '[Notification - Create API: Managing Class] Load classes Failed'
);
