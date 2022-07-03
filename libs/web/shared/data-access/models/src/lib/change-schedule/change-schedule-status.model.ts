import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';

export interface ChangeScheduleStatus {
  data: EApiStatus;
  queue: number[];
}
