import { ChangeSchedule } from './change-schedule.model';

export interface ChangeScheduleResponse {
  data: ChangeSchedule[];
  meta: {
    total: number;
  };
}
