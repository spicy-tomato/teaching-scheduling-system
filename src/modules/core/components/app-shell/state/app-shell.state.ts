import { EApiStatus } from '@shared/enums';
import { Nullable, Teacher } from 'src/shared/models';

export interface AppShellState {
  preResetInGuard: boolean;
  status: EApiStatus;
  rooms: string[];
  teacher: Nullable<Teacher>;
}
