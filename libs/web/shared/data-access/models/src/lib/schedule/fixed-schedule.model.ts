import {
  Nullable,
  RequestChangeScheduleCode,
} from '@teaching-scheduling-system/core/data-access/models';

export interface SimpleFixedScheduleModel {
  id: number;
  newDate: Nullable<string>;
  newShift: Nullable<string>;
  newIdRoom: Nullable<string>;
  status: RequestChangeScheduleCode;
  createdAt: Date;
  intendTime: Nullable<string>;
}

export interface FixedScheduleModel extends SimpleFixedScheduleModel {
  idSchedule: number;
  oldDate: string;
  oldIdRoom: string;
  oldShift: string;
  isNew?: boolean;
}
