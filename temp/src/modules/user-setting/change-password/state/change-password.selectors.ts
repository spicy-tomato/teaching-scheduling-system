import { createFeatureSelector, createSelector } from '@ngrx/store';
import { changePasswordFeatureKey, ChangePasswordState } from '.';

const changePasswordSelector = createFeatureSelector<ChangePasswordState>(
  changePasswordFeatureKey
);

export const selectStatus = createSelector(
  changePasswordSelector,
  (state) => state.status
);
