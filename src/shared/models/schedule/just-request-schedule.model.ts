import { Nullable } from '../core/nullable.model';
import { SimpleFixedScheduleModel } from './fixed-schedule.model';

export interface ChangedScheduleModel {
  to: Nullable<SimpleFixedScheduleModel>;
  note?: Nullable<string>;
}
