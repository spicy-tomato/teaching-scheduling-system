import { createFeatureSelector, createSelector } from "@ngrx/store";
import { mainViewFeatureKey, MainViewState } from ".";

const mainViewSelector = createFeatureSelector<MainViewState>(mainViewFeatureKey);

export const selectBreadcrumbs = createSelector(
  mainViewSelector,
  (state) => {
    return state.breadcrumbs;
  }
);
