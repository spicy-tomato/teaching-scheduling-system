import { ChangeSchedule } from './change-schedule.model';

export interface ChangeScheduleResponse {
  data: ChangeSchedule[];
  meta: {
    last_page: number;
  };
}
