import { AcademicYear } from '@models/core/academic-year.model';

export interface AssignScheduleState {
  currentTerm: string;
  academicYears: AcademicYear;
}
