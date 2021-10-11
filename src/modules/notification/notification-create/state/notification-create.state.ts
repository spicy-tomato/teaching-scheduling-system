import { ValidationErrors } from "@angular/forms";
import { AppState } from "@modules/app/state/app.reducer";

export interface NotificationCreateState extends AppState {
  errors: {
    [key: string]: ValidationErrors;
  };
}
