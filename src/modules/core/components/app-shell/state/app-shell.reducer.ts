import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from 'src/shared/enums/api-status.enum';
import { AppShellState } from '.';
import * as ApiAction from './app-shell.api.actions';
import * as PageAction from './app-shell.page.actions';

const initialState: AppShellState = {
  teacher: undefined,
  status: EApiStatus.unknown,
};

export const appShellFeatureKey = 'app-shell';

export const appShellReducer = createReducer(
  initialState,
  on(PageAction.reset, () => initialState),
  on(PageAction.tryAutoLogin, (state) => ({
    ...state,
    status: EApiStatus.loading,
  })),
  on(ApiAction.autoLoginSuccessfully, (state, { teacher }) => ({
    ...state,
    teacher,
  })),
  on(ApiAction.autoLoginFailure, () => ({
    teacher: undefined,
    status: EApiStatus.clientError,
  }))
);
