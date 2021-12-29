import { createAction, props } from '@ngrx/store';
import { ErrorMapModel } from 'src/shared/models';
import { NotificationCreateFormModel } from 'src/shared/models/notification/notification-create/notification-create-form.model';

export const reset = createAction('[Notification - Create Page] Reset');

export const loadManagingClassForm = createAction(
  '[Notification - Create Page: Managing class] Load Form'
);

export const loadManagingClasses = createAction(
  '[Notification - Create Page: Managing class] Load Classes',
  props<{
    academicYears: number[];
    faculties: string[];
  }>()
);

export const clickConfirm = createAction(
  '[Notification - Create Page] Click confirm',
  props<{
    value: NotificationCreateFormModel;
    errors: ErrorMapModel;
  }>()
);
