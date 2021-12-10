import { createFeatureSelector, createSelector } from '@ngrx/store';
import { changePasswordFeatureKey, ChangePasswordState } from '.';

const loginSelector = createFeatureSelector<ChangePasswordState>(
  changePasswordFeatureKey
);

export const selectStatus = createSelector(
  loginSelector,
  (state) => state.status
);
