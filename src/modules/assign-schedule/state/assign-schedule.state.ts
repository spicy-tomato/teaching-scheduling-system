import { AcademicYear } from '@models/core/academic-year.model';

export interface AssignScheduleState {
  schoolYears: string[];
  academicYears: AcademicYear;
}
