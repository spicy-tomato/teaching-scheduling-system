import { Teacher } from "@models/core/teacher.model";

export interface AuthResponse {
  token: string;
  teacher: Teacher;
}
