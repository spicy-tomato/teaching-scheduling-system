import { Nullable } from '..';
import { SimpleModel } from '../core';

export interface ChangeScheduleOptions {
  status: Nullable<number>;
  teacher: Nullable<SimpleModel>;
  showTimeInsteadOfShift: boolean;
  showTime: boolean;
  showReason: boolean;
}

export type ChangeScheduleOptionsParam = Partial<ChangeScheduleOptions>;
