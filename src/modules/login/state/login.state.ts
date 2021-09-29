import { AppState } from "@modules/app/state/app.reducer";

export enum LoginStatus {
  unknown,
  failed,
  loading,
  successful
}

export interface LoginState extends AppState {
  status: LoginStatus;
}
