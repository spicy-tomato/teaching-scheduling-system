import {
  ChangeScheduleOptions,
  ChangeScheduleSearch,
  ChangeScheduleStatus,
  RequestDataState,
} from '@shared/models';

export interface RequestsState {
  status: ChangeScheduleStatus;
  options: ChangeScheduleOptions;
  data: RequestDataState;
  total: number;
  query: ChangeScheduleSearch;
}
