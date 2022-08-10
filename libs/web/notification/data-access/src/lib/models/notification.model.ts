import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { EchoMessage } from './echo.model';

export interface NotificationPage {
  data: EchoMessage[];
  hasNext: boolean;
  milestone: Nullable<string>;
}
