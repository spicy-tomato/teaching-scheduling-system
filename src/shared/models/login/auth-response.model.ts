import { CommonInfoModel, Teacher } from '..';

export interface AuthResponse {
  token: string;
  teacher?: Teacher;
  commonInfo?: CommonInfoModel;
}
