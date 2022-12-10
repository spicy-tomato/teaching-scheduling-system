import { createAction, props } from '@ngrx/store';
import { GoogleCalendar } from '@teaching-scheduling-system/web/shared/data-access/models';
import { SidebarField } from './sidebar.model.store';

export const setDataState = createAction(
  '[Sidebar API] Set data state',
  props<{ dataState: Record<SidebarField, boolean> }>()
);

export const loadGoogleCalendarListSuccessful = createAction(
  '[Sidebar API] Load Google calendar list successfully',
  props<{ list: GoogleCalendar[] }>()
);

export const loadGoogleCalendarListFailure = createAction(
  '[Sidebar API] Load Google calendar list failure'
);
