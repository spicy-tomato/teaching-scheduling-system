import { EApiStatus } from '@shared/enums';
import { ChangeSchedule, ChangeScheduleSearch } from '@shared/models';

export interface RequestsState {
  status: EApiStatus;
  changeSchedules: ChangeSchedule[];
  total: number;
  query: ChangeScheduleSearch;
}
