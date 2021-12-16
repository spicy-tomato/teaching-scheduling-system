import { ScheduleFilter } from '@models/schedule/schedule-filter.model';
import { ScheduleModel } from '@models/schedule/schedule.model';
import { EApiStatus } from 'src/shared/enums/api-status.enum';

export interface ScheduleState {
  status: EApiStatus;
  schedules: ScheduleModel[];
  filter: ScheduleFilter;
}
