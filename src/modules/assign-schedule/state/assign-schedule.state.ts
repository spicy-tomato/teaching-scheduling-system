import { ModuleClass } from '@models/class/module-class.model';
import { AcademicYear } from '@models/core/academic-year.model';
import { EApiStatus } from 'src/shared/enums/api-status.enum';

export interface AssignScheduleState {
  currentTerm: string;
  academicYears: AcademicYear;
  needAssign: ModuleClass[];
  assigned: ModuleClass[];
  status: EApiStatus;
}
