import { AppState } from '@modules/app/state/app.reducer';
import { EApiStatus } from 'src/enums/api-status.enum';

export interface LoginState extends AppState {
  status: EApiStatus;
}
