import { ErrorMapModel } from '@models/core/error-map.model';
import { NotificationCreateManagingClassViewModel } from '@models/notification/notification-create/view/notification-create-managing-class-view.model';
import { EApiStatus } from 'src/shared/enums/api-status.enum';

export interface NotificationCreateState {
  status: EApiStatus;
  managingData: NotificationCreateManagingClassViewModel;
  errors: ErrorMapModel;
}
