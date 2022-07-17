import { createReducer, on } from '@ngrx/store';
import { LoginState } from '.';
import * as ApiAction from './login.api.actions';
import * as PageAction from './login.page.actions';

const initialState: LoginState = {
  status: 'unknown',
};

export const loginFeatureKey = 'login';

export const loginReducer = createReducer(
  initialState,
  on(PageAction.reset, () => initialState),
  on(PageAction.clickLogin, (state) => ({
    ...state,
    status: 'loading',
  })),
  on(ApiAction.loginSuccessful, (state) => ({
    ...state,
    status: 'successful',
  })),
  on(ApiAction.wrongPassword, (state) => ({
    ...state,
    status: 'clientError',
  })),
  on(ApiAction.systemError, (state) => ({
    ...state,
    status: 'systemError',
  }))
);
