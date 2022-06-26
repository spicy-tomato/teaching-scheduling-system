import {
  ChangeSchedule,
  ChangeScheduleOptions,
  ChangeScheduleSearch,
  ChangeScheduleStatus,
} from '@teaching-scheduling-system/web/shared/data-access/models';

export interface TeachingScheduleRequestState {
  status: ChangeScheduleStatus;
  options: ChangeScheduleOptions;
  changeSchedules: ChangeSchedule[];
  total: number;
  query: ChangeScheduleSearch;
  exportIndexes: boolean[];
}
