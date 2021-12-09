import { EApiStatus } from 'src/shared/enums/api-status.enum';
import { Teacher } from '@models/core/teacher.model';

export interface AppShellState {
  status: EApiStatus;
  teacher?: Teacher;
}
