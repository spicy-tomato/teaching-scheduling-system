import { Nullable } from '@teaching-scheduling-system/core/data-access/models';

export interface ModuleClass {
  id: string;
  name: string;
  credit?: number;
  type?: number;
  numberPlan?: number;
  numberReality?: number;
  teacher?: Nullable<string>;
}
