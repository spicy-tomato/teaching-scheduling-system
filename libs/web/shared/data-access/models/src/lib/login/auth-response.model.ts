import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { Teacher } from '../core';

export interface AuthResponse {
  token: string;
  teacher: Nullable<Teacher>;
}
