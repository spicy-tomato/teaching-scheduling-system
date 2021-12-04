import { ScheduleModel } from '@models/schedule/schedule.model';
import { AppState } from '@modules/app/state/app.reducer';
import { EApiStatus } from 'src/enums/api-status.enum';

export interface ScheduleState extends AppState {
  status: EApiStatus;
  schedules: ScheduleModel[];
}
