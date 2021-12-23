import { AcademicYear } from '@models/core/academic-year.model';
import { Faculty } from '@models/core/faculty.model';
import { ManagingClass } from '@models/core/managing-class.model';

export interface NotificationCreateManagingClassViewModel {
  academicYears: AcademicYear;
  faculties: Faculty[];
  classes: ManagingClass[];
}
