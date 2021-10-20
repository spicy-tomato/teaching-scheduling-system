import { AcademicYear } from "@models/core/academic-year.model";
import { Faculty } from "@models/core/faculty.model";

export interface NotificationCreateManagingClassViewModel {
  academicYears: AcademicYear[];
  faculties: Faculty[];
}
