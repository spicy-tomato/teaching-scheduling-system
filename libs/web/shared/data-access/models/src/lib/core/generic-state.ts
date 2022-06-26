import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';

export interface GenericState<T> {
  data: T;
  status: EApiStatus;
  error: Nullable<string>;
}
