import { Teacher } from '..';
import { Nullable } from '../core';

export interface AuthResponse {
  token: string;
  teacher: Nullable<Teacher>;
}
