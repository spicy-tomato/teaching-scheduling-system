import { Nullable } from '@teaching-scheduling-system/core/data-access/models';

export interface RequestChangeSchedulePayload {
  idSchedule: number;
  newDate: string;
  newShift: string;
  newIdRoom: Nullable<string>;
  reason: string;
}

export interface RequestIntendChangeSchedulePayload {
  idSchedule: number;
  intendTime: string;
  reason: string;
}
