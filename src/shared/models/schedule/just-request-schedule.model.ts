import { Nullable } from '../core/nullable.model';

export interface JustRequestedScheduleModel {
  newDate: string;
  newShift: string;
  newIdRoom: Nullable<string>;
}
