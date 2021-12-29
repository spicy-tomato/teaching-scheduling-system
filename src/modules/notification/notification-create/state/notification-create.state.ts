import { EApiStatus } from 'src/shared/enums/api-status.enum';
import { ErrorMapModel } from 'src/shared/models';
import { NotificationCreateManagingClassViewModel } from 'src/shared/models/notification/notification-create/view/notification-create-managing-class-view.model';

export interface NotificationCreateState {
  status: EApiStatus;
  managingData: NotificationCreateManagingClassViewModel;
  errors: ErrorMapModel;
}
