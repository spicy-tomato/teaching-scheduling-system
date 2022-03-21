import { Nullable } from "../core";

export interface SimpleFixedScheduleModel {
  id: number;
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
  isNew?: boolean;
}
