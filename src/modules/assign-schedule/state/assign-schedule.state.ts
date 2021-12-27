import { ModuleClass } from '@models/class/module-class.model';
import { AcademicYear } from '@models/core/academic-year.model';
import { SimpleMapModel } from '@models/core/simple-map.model';
import { SimpleModel } from '@models/core/simple.model';
import { EApiStatus } from 'src/shared/enums/api-status.enum';

export interface AssignScheduleState {
  currentTerm: string;
  academicYears: AcademicYear;
  departments: SimpleMapModel<string, SimpleModel[]>[];
  needAssign: { data: ModuleClass[]; selected: boolean[] };
  assigned: { data: ModuleClass[]; selected: boolean[] };
  status: EApiStatus;
  teacher: {
    data: SimpleModel[];
    selected: SimpleModel | null;
    action: SimpleModel | null;
    actionCount: number;
  };
  // assignedSuccessful: { teacherName: string; classCount: number };
}
