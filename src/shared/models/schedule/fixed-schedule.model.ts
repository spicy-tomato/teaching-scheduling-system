import { Nullable } from '../core';

export interface SimpleFixedScheduleModel {
  id: number;
  newDate: string;
  newShift: string;
  newIdRoom: Nullable<string>;
  status: number;
  createdAt: Date;
}

export interface IntendFixedScheduleModel {
  id: number;
  intendTime: string;
  status: number;
  createdAt: Date;
}

export interface FixedScheduleModel extends SimpleFixedScheduleModel {
  idSchedule: number;
  oldDate: string;
  oldIdRoom: string;
  oldShift: string;
  isNew?: boolean;
}
