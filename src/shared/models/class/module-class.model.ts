import { Nullable } from '../core';

export interface ModuleClass {
  id: string;
  name: string;
  credit?: number;
  classType?: string;
  numberPlan?: number;
  teacher?: Nullable<string>;
}
