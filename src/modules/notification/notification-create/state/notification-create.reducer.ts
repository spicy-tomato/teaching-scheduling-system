import { createReducer, on } from "@ngrx/store";
import { NotificationCreateState } from ".";
import * as ApiAction from "./notification-create.api.actions";
import * as PageAction from "./notification-create.page.actions";

const initialState: NotificationCreateState = {
  errors: {}
};

export const notificationCreateFeatureKey = 'notification-create';

export const notificationCreateReducer = createReducer(
  initialState,
  on(ApiAction.invalidForm, (state, action) => ({
    ...state,
    errors: action.errors
  }))
)
