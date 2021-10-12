import { ErrorMapModel } from "@models/core/error-map.model";
import { NotificationCreateFormModel } from "@models/notification/notification-create/notification-create-form.model";
import { createAction, props } from "@ngrx/store";

export const clickConfirm = createAction(
  '[Notification - Create Page] Click confirm',
  props<{
    value: NotificationCreateFormModel,
    errors: ErrorMapModel;
  }>()
);
