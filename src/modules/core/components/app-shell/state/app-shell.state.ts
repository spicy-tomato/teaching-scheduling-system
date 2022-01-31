import { EApiStatus } from '@shared/enums';
import { Nullable, Teacher } from 'src/shared/models';

export interface AppShellState {
  status: EApiStatus;
  teacher: Nullable<Teacher>;
}
