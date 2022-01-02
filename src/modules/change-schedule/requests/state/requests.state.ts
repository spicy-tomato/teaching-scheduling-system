import {
  ChangeSchedule,
  ChangeScheduleSearch,
  ChangeScheduleStatus,
} from '@shared/models';

export interface RequestsState {
  status: ChangeScheduleStatus;
  changeSchedules: ChangeSchedule[];
  total: number;
  query: ChangeScheduleSearch;
}
