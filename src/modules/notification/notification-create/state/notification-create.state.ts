import { ErrorMapModel } from "@models/core/error-map.model";
import { AppState } from "@modules/app/state/app.reducer";
import { EApiStatus } from "src/enums/api-status.enum";

export interface NotificationCreateState extends AppState {
  status: EApiStatus,
  errors: ErrorMapModel
}
