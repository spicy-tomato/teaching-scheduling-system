import { Nullable } from '../core/nullable.model';
import { ChangeSchedulePayload } from './change-schedule-payload.model';
import { FixedScheduleModel } from './fixed-schedule.model';

export interface ChangedScheduleModel {
  id: number;
  fixedSchedules: Nullable<FixedScheduleModel[]>;
  schedule: {
    change: boolean;
    data: ChangeSchedulePayload;
    note: string;
  };
}
