import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from '@shared/enums';
import { LoginState } from '.';
import * as ApiAction from './login.api.actions';
import * as PageAction from './login.page.actions';

const initialState: LoginState = {
  status: EApiStatus.unknown,
};

export const loginFeatureKey = 'login';

export const loginReducer = createReducer(
  initialState,
  on(PageAction.reset, () => initialState),
  on(PageAction.clickLogin, (state) => ({
    ...state,
    status: EApiStatus.loading,
  })),
  on(ApiAction.loginSuccessful, (state) => ({
    ...state,
    status: EApiStatus.successful,
  })),
  on(ApiAction.wrongPassword, (state) => ({
    ...state,
    status: EApiStatus.clientError,
  })),
  on(ApiAction.systemError, (state) => ({
    ...state,
    status: EApiStatus.systemError,
  }))
);
