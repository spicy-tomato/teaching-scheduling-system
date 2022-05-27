import { Nullable } from '../core/nullable.model';
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
  };
};
