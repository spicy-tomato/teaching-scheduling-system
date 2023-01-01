import { View } from '@syncfusion/ej2-angular-schedule';
import { TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  Activatable,
  CalendarFilter,
  ExamScheduleModel,
  GoogleCalendarEvent,
  StudyScheduleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';

export interface CalendarState {
  status: EApiStatus;
  filter: Activatable<CalendarFilter>;
  schedules: {
    personal: {
      study: StudyScheduleModel[];
      exam: ExamScheduleModel[];
      ranges: TuiDayRange[];
    };
    department: {
      study: StudyScheduleModel[];
      exam: ExamScheduleModel[];
      ranges: TuiDayRange[];
    };
  };
  googleCalendar: {
    events: GoogleCalendarEvent[];
    ranges: TuiDayRange[];
  };
  view: View;
  selectedDate: Date;
  month: TuiMonth;
}
