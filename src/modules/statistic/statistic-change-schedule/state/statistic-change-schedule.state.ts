import { EApiStatus } from '@shared/enums';
import { ChangeSchedule, SimpleModel } from 'src/shared/models';

export interface StatisticChangeScheduleState {
  status: EApiStatus;
  changeSchedules: ChangeSchedule[];
  teachersList: SimpleModel[];
}
