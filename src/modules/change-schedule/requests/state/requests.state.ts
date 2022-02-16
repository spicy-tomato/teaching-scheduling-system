import {
  ChangeSchedule,
  ChangeScheduleOptions,
  ChangeScheduleSearch,
  ChangeScheduleStatus,
} from '@shared/models';

export interface RequestsState {
  status: ChangeScheduleStatus;
  options: ChangeScheduleOptions;
  changeSchedules: ChangeSchedule[];
  total: number;
  query: ChangeScheduleSearch;
}
