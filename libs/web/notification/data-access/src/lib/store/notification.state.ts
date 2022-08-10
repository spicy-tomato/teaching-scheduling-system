import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { GenericState } from '@teaching-scheduling-system/web/shared/data-access/models';
import { EchoMessage } from '../models';

export type NotificationType = GenericState<EchoMessage[]> & {
  hasNext: boolean;
  milestone: Nullable<string>;
};

export interface NotificationState {
  all: NotificationType;
  unread: NotificationType;
}
