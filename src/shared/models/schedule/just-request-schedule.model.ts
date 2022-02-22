import { Nullable } from '../core/nullable.model';
import { FixedScheduleModel } from './fixed-schedule.model';

export interface ChangedScheduleModel {
  fixedSchedules: Nullable<FixedScheduleModel[]>;
  note?: Nullable<string>;
}
