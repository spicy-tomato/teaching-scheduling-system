import { createReducer, on } from "@ngrx/store";
import { EApiStatus } from "src/enums/api-status.enum";
import { NotificationCreateState } from ".";
import * as ApiAction from "./notification-create.api.actions";
import * as PageAction from "./notification-create.page.actions";

const initialState: NotificationCreateState = {
  status: EApiStatus.unknown,
  errors: {}
};

export const notificationCreateFeatureKey = 'notification-create';

export const notificationCreateReducer = createReducer(
  initialState,
  on(PageAction.clickConfirm, (state) => ({
    ...state,
    status: EApiStatus.loading
  })),
  on(ApiAction.submitFailure, (state) => ({
    ...state,
    status: EApiStatus.failed
  })),
  on(ApiAction.submitSuccessful, (state) => ({
    ...state,
    status: EApiStatus.successful
  })),
  on(ApiAction.invalidForm, (state, { errors }) => ({
    ...state,
    errors,
    status: EApiStatus.failed,
  }))
);
