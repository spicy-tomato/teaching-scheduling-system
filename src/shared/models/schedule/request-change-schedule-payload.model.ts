import { Nullable } from '../core';

export interface RequestChangeSchedulePayload {
  idSchedule: number;
  newDate: string;
  newShift: string;
  newIdRoom: Nullable<string>;
  reason: string;
}

export interface RequestIntendChangeSchedulePayload {
  intendTime: string;
  reason: string;
}
