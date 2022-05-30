import { EApiStatus } from '@shared/enums';
import { Nullable } from './nullable.model';

export interface GenericState<T> {
  data: Nullable<T>;
  status: EApiStatus;
  error: Nullable<string>;
}
