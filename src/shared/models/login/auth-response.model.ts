import { CommonInfoModel } from '@models/core/common-info.model';
import { Teacher } from '@models/core/teacher.model';

export interface AuthResponse {
  token: string;
  teacher?: Teacher;
  commonInfo?: CommonInfoModel;
}
