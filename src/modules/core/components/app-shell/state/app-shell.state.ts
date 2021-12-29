import { EApiStatus } from 'src/shared/enums/api-status.enum';
import { Teacher } from 'src/shared/models';

export interface AppShellState {
  status: EApiStatus;
  teacher?: Teacher;
}
