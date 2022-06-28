import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  ModuleClass,
  SimpleMapModel,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';

export interface TeachingScheduleAssignState {
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
