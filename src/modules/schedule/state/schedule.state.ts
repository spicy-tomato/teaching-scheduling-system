import { ScheduleModel } from '@models/schedule/schedule.model';
import { EApiStatus } from 'src/enums/api-status.enum';

export interface ScheduleState {
  status: EApiStatus;
  schedules: ScheduleModel[];
}
