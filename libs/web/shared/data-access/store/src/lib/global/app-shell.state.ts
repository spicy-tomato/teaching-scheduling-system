import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  Teacher,
  AcademicData,
  SimpleModel,
  BreadcrumbItem,
  GoogleCalendar,
} from '@teaching-scheduling-system/web/shared/data-access/models';

export interface AppShellState {
  status: EApiStatus;
  breadcrumbs: BreadcrumbItem[];
  rooms: string[];
  teacher: Nullable<Teacher>;
  currentTerm: string;
  academicData: AcademicData[];
  teachersInDepartment: SimpleModel[];
  showLoader: Nullable<boolean>;
  googleCalendars: GoogleCalendar[];
}
