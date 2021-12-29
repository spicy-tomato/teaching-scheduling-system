import { EApiStatus } from 'src/shared/enums/api-status.enum';
import {
  AcademicYear,
  SimpleMapModel,
  SimpleModel,
  ModuleClass,
  Nullable,
} from 'src/shared/models';

export interface AssignScheduleState {
  currentTerm: string;
  academicYears: AcademicYear;
  departments: SimpleMapModel<string, SimpleModel[]>[];
  needAssign: { data: ModuleClass[]; selected: boolean[] };
  assigned: { data: ModuleClass[]; selected: boolean[] };
  status: {
    filter: EApiStatus;
    assign: EApiStatus;
    unassign: EApiStatus;
  };
  teacher: {
    data: SimpleModel[];
    selected: Nullable<SimpleModel>;
    action: Nullable<SimpleModel>;
    actionCount: number;
  };
}
