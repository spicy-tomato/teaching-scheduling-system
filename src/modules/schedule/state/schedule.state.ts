import { ScheduleFilter } from '@models/schedule/schedule-filter.model';
import { ScheduleModel } from '@models/schedule/schedule.model';
import { View } from '@syncfusion/ej2-angular-schedule';
import { TuiMonth } from '@taiga-ui/cdk';
import { EApiStatus } from 'src/shared/enums/api-status.enum';

export interface ScheduleState {
  status: EApiStatus;
  filter: ScheduleFilter;
  schedules: ScheduleModel[];
  view: View;
  selectedDate: Date;
  month: TuiMonth;
}
