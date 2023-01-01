import { createReducer, on } from '@ngrx/store';
import * as ApiAction from './sidebar.api.actions';
import { GoogleCalendarType, SidebarField } from './sidebar.model.store';
import * as PageAction from './sidebar.page.actions';
import { SidebarState } from './sidebar.state';

const initialState: SidebarState = {
  event: null,
  dataState: <Record<SidebarField, boolean>>{},
  googleCalendarStatus: 'unknown',
  googleCalendarList: [],
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
  })),
  on(ApiAction.loadGoogleCalendarListSuccessful, (state, { list }) => {
    const staticCalendar = Object.entries(state.dataState).reduce(
      (acc, curr) => {
        if (!curr[0].includes('@')) {
          acc[curr[0] as SidebarField] = curr[1];
        }
        return acc;
      },
      {} as Record<SidebarField, boolean>
    );

    return {
      ...state,
      googleCalendarStatus: 'successful',
      googleCalendarList: list,
      dataState: {
        ...staticCalendar,
        ...list
          .map(({ id }) => `calendar.@${id}` as GoogleCalendarType)
          .reduce<Record<GoogleCalendarType, boolean>>((acc, curr) => {
            acc[curr] = true;
            return acc;
          }, {}),
      },
    };
  }),
  on(ApiAction.loadGoogleCalendarListFailure, (state) => ({
    ...state,
    googleCalendarStatus: 'clientError',
  }))
);
