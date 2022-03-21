import { EApiStatus } from '@shared/enums';

export interface ChangeScheduleStatus {
  data: EApiStatus;
  queue: number[];
}
