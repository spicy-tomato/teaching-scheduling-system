import { createFeatureSelector, createSelector } from "@ngrx/store";
import { loginFeatureKey, LoginState } from ".";

const loginSelector = createFeatureSelector<LoginState>(loginFeatureKey);

export const selectState = createSelector(
  loginSelector,
  (state) => state.status
);
