import { createFeatureSelector, createSelector, select } from '@ngrx/store';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { filter, map, pipe } from 'rxjs';
import { ExtractValue, SidebarEventName } from './sidebar.model.store';
import { sidebarFeatureKey } from './sidebar.reducer';
import { SidebarState } from './sidebar.state';

const sidebarSelector = createFeatureSelector<SidebarState>(sidebarFeatureKey);

export const sidebar_selectDataState = createSelector(
  sidebarSelector,
  (state) => state.dataState
);

export const sidebar_selectEvent = createSelector(
  sidebarSelector,
  (state) => state.event
);

export const sidebar_selectGoogleCalendarStatus = createSelector(
  sidebarSelector,
  (state) => state.googleCalendarStatus
);

export const sidebar_listen = <T extends SidebarEventName>(eventName: T) =>
  pipe(
    select(sidebar_selectEvent),
    ObservableHelper.filterNullish(),
    filter(({ name }) => name === eventName),
    map(({ value }) => value as ExtractValue<T>)
  );
