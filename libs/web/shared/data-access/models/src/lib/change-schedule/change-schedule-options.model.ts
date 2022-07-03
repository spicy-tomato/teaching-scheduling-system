import {
  Nullable,
  RequestChangeScheduleCode,
} from '@teaching-scheduling-system/core/data-access/models';
import { SimpleModel } from '../core';

export interface ChangeScheduleOptions {
  status: Nullable<RequestChangeScheduleCode>;
  teacher: Nullable<SimpleModel>;
  showTime: boolean;
  showReason: boolean;
}

export type ChangeScheduleOptionsParam = Partial<ChangeScheduleOptions>;
