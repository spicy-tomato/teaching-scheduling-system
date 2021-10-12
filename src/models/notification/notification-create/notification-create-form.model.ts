import { NotificationCreateClassModel } from "./notification-create-class.model";
import { NotificationCreateCommonFormModel } from "./notification-create-common-form.model";

export interface NotificationCreateFormModel {
  content: NotificationCreateCommonFormModel;
  class: NotificationCreateClassModel
}
