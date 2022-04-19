import { Nullable } from '..';
import { RequestChangeScheduleCode, SimpleModel } from '../core';

export interface ChangeScheduleOptions {
  status: Nullable<RequestChangeScheduleCode>;
  teacher: Nullable<SimpleModel>;
  showTimeInsteadOfShift: boolean;
  showTime: boolean;
  showReason: boolean;
}

export type ChangeScheduleOptionsParam = Partial<ChangeScheduleOptions>;
