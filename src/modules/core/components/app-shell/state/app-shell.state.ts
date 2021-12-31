import { EApiStatus } from '@shared/enums';
import { Teacher } from 'src/shared/models';

export interface AppShellState {
  status: EApiStatus;
  teacher?: Teacher;
}
