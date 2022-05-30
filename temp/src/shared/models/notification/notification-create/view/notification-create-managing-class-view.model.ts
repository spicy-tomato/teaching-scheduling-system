import { AcademicYear, Faculty, ManagingClass } from 'src/shared/models';

export interface NotificationCreateManagingClassViewModel {
  academicYears: AcademicYear;
  faculties: Faculty[];
  classes: ManagingClass[];
}
