import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  ModuleClass,
  SimpleMapModel,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';

export interface TeachingScheduleAssignState {
  departments: SimpleMapModel<string, SimpleModel[]>[];
  data: ModuleClass[];
  selected: string[];
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
