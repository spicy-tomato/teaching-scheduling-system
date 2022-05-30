import { Nullable } from '..';
import { RequestChangeScheduleCode, SimpleModel } from '../core';

export interface ChangeScheduleOptions {
  status: Nullable<RequestChangeScheduleCode>;
  teacher: Nullable<SimpleModel>;
  showTime: boolean;
  showReason: boolean;
}

export type ChangeScheduleOptionsParam = Partial<ChangeScheduleOptions>;
