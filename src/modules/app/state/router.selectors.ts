import { getSelectors } from "@ngrx/router-store";

export const {
  selectCurrentRoute,
  selectRouteData,
  selectUrl
} = getSelectors();

