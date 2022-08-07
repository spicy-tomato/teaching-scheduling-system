import { createReducer, on } from '@ngrx/store';
import * as ApiAction from './sidebar.api.actions';
import { SidebarField } from './sidebar.model.store';
import * as PageAction from './sidebar.page.actions';
import { SidebarState } from './sidebar.state';

const initialState: SidebarState = {
  event: null,
  dataState: <Record<SidebarField, boolean>>{},
};

export const sidebarFeatureKey = 'sidebar';

export const sidebarReducer = createReducer(
  initialState,
  on(PageAction.sidebar_reset, (state) => ({
    ...state,
    dataState: (Object.keys(state.dataState) as SidebarField[]).reduce(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      <Record<SidebarField, boolean>>{}
    ),
  })),
  on(PageAction.sidebar_emit, (state, { event }) => ({
    ...state,
    event,
  })),
  on(ApiAction.setDataState, (state, { dataState }) => ({
    ...state,
    dataState,
  }))
);
