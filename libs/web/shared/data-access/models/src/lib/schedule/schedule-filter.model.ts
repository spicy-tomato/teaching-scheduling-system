import { SimpleModel } from '../core';

export interface CalendarFilter {
  showDepartmentSchedule: boolean;
  teachers: SimpleModel[];
  modules: string[];
}

export interface CalendarFilterParams {
  showDepartmentSchedule?: boolean;
  teachers?: SimpleModel[];
}
