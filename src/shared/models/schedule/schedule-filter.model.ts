export interface ScheduleFilter {
  showDepartmentSchedule: boolean;
  teachers: string[];
  modules: string[];
}

export interface ScheduleFilterParams {
  showDepartmentSchedule?: boolean;
  teachers?: string[];
}
