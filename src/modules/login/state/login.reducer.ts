import { createReducer, on } from "@ngrx/store";
import { LoginState } from ".";
import * as ApiAction from "./login.api.actions";
import * as PageAction from "./login.page.actions";
import { LoginStatus } from "./login.state";

const initialState: LoginState = { 
  status: LoginStatus.unknown
 };

export const loginFeatureKey = 'login';

export const loginReducer = createReducer(
  initialState,
  on(PageAction.clickLogin, (state) => ({
    ...state,
    status: LoginStatus.loading
  })),
  on(ApiAction.loginSuccessful, (state) => ({
    ...state,
    status: LoginStatus.successful
  })),
  on(ApiAction.loginFailure, (state) => ({
    ...state,
    status: LoginStatus.failed
  }))
);
