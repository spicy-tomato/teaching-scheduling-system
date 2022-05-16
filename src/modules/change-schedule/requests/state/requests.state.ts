import {
  ChangeSchedule,
  ChangeScheduleOptions,
  ChangeScheduleSearch,
  ChangeScheduleStatus,
  SimpleModel,
} from '@shared/models';

export interface RequestsState {
  status: ChangeScheduleStatus;
  options: ChangeScheduleOptions;
  changeSchedules: ChangeSchedule[];
  teachers: SimpleModel[];
  total: number;
  query: ChangeScheduleSearch;
  exportIndexes: boolean[];
}
