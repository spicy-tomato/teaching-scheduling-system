import { Nullable } from '..';

export interface ChangeScheduleOptions {
  selectedStatus: Nullable<number>;
  showTimeInsteadOfShift: boolean;
  showTime: boolean;
}

export interface ChangeScheduleOptionsParam {
  selectedStatus?: Nullable<number>;
  showTimeInsteadOfShift?: boolean;
  showTime?: boolean;
}
