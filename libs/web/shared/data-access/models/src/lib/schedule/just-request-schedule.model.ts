import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { ChangeSchedulePayload } from './change-schedule-payload.model';
import { FixedScheduleModel } from './fixed-schedule.model';

export type ChangedScheduleModel = {
  [key: number]: {
    id: number;
    fixedSchedules: Nullable<FixedScheduleModel[]>;
    schedule: {
      change: boolean;
      data: ChangeSchedulePayload;
      note: string;
    };
  } | null;
};
