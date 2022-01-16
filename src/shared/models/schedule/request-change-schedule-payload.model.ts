import { Nullable } from '../core';

export interface RequestChangeSchedulePayload {
  idSchedule: number;
  newDate: string;
  newShift: string;
  newIdRoom: Nullable<string>;
  timeRequest: string;
  reason: string;
}
