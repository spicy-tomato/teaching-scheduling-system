import { ErrorMapModel } from '@models/core/error-map.model';
import { NotificationCreateManagingClassViewModel } from '@models/notification/notification-create/view/notification-create-managing-class-view.model';
import { AppState } from '@modules/app/state/app.reducer';
import { EApiStatus } from 'src/enums/api-status.enum';

export interface NotificationCreateState extends AppState {
  status: EApiStatus;
  managingData: NotificationCreateManagingClassViewModel;
  errors: ErrorMapModel;
}
