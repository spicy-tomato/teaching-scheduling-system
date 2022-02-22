import { Nullable } from "../core";

export interface SimpleFixedScheduleModel {
  newDate: string;
  newShift: string;
  newIdRoom: Nullable<string>;
  status: number;
  timeRequest: Date;
}

export interface FixedScheduleModel extends SimpleFixedScheduleModel {
  idSchedule: number;
  oldDate: string;
  oldIdRoom: string;
  oldShift: string;
}
