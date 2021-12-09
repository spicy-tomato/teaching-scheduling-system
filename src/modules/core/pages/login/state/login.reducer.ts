import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from 'src/shared/enums/api-status.enum';
import { LoginState } from '.';
import * as ApiAction from './login.api.actions';
import * as PageAction from './login.page.actions';

const initialState: LoginState = {
  status: EApiStatus.unknown,
};

export const loginFeatureKey = 'login';

export const loginReducer = createReducer(
  initialState,
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
