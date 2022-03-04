import { EApiStatus } from '@shared/enums';
import { ChangeSchedule } from 'src/shared/models';

export interface StatisticChangeScheduleState {
  status: EApiStatus;
  changeSchedules: ChangeSchedule[];
}
