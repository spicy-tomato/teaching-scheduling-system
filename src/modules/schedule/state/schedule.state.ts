import { View } from '@syncfusion/ej2-angular-schedule';
import { TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import { EApiStatus } from '@shared/enums';
import {
  Activatable,
  ScheduleFilter,
  StudyScheduleModel,
  ExamScheduleModel,
} from 'src/shared/models';

export interface ScheduleState {
  status: EApiStatus;
  filter: Activatable<ScheduleFilter>;
  schedules: {
    personal: {
      study: StudyScheduleModel[];
      exam: ExamScheduleModel[];
    };
    department: {
      study: StudyScheduleModel[];
      exam: ExamScheduleModel[];
    };
  };
  ranges: TuiDayRange[];
  view: View;
  selectedDate: Date;
  month: TuiMonth;
}
