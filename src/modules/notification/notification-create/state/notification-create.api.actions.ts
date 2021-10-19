import { AcademicYear } from '@models/core/academic-year.model';
import { ErrorMapModel } from '@models/core/error-map.model';
import { createAction, props } from '@ngrx/store';

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

export const loadManagingClassSuccessful = createAction(
  '[Notification - Create API: Managing Class] Load Successfully',
  props<{ academicYears: AcademicYear[] }>()
);

export const loadManagingClassFailure = createAction(
  '[Notification - Create API: Managing Class] Load Failed'
);
