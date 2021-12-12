import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from 'src/shared/enums/api-status.enum';
import { ChangePasswordState } from '.';
import * as ApiAction from './change-password.api.actions';
import * as PageAction from './change-password.page.actions';

const initialState: ChangePasswordState = {
  status: EApiStatus.unknown,
};

export const changePasswordFeatureKey = 'changePassword';

export const changePasswordReducer = createReducer(
  initialState,
  on(PageAction.reset, () => initialState),
  on(PageAction.change, (state) => ({
    ...state,
    status: EApiStatus.loading,
  })),
  on(ApiAction.changeSuccessful, (state) => {
    return {
      ...state,
      status: EApiStatus.successful,
    };
  }),
  on(ApiAction.changeFailure, (state) => ({
    ...state,
    status: EApiStatus.clientError,
  }))
);
