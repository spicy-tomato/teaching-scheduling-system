import { ScheduleFilter } from '@models/schedule/schedule-filter.model';
import { ExamScheduleModel } from '@models/schedule/exam-schedule.model';
import { View } from '@syncfusion/ej2-angular-schedule';
import { TuiMonth } from '@taiga-ui/cdk';
import { EApiStatus } from 'src/shared/enums/api-status.enum';
import { StudyScheduleModel } from '@models/schedule/study-schedule.model';

export interface ScheduleState {
  status: EApiStatus;
  filter: ScheduleFilter;
  schedules: {
    study: StudyScheduleModel[];
    exam: ExamScheduleModel[];
  };
  view: View;
  selectedDate: Date;
  month: TuiMonth;
}
