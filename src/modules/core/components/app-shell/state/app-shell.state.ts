import { EApiStatus } from '@shared/enums';
import { Nullable, Teacher } from 'src/shared/models';

export interface AppShellState {
  status: EApiStatus;
  rooms: string[];
  teacher: Nullable<Teacher>;
}
