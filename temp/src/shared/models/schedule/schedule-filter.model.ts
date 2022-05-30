import { SimpleModel } from '../core';

export interface ScheduleFilter {
  showDepartmentSchedule: boolean;
  teachers: SimpleModel[];
  modules: string[];
}

export interface ScheduleFilterParams {
  showDepartmentSchedule?: boolean;
  teachers?: SimpleModel[];
}
