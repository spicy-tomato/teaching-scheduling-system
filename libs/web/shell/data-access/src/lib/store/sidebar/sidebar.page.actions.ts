import { createAction, props } from '@ngrx/store';
import { SidebarEvent } from './sidebar.model.store';

export const sidebar_reset = createAction('[Sidebar Page] Reset');

export const sidebar_emit = createAction(
  '[Sidebar Page] Emit',
  props<{ event: SidebarEvent }>()
);

export const sidebar_loadGoogleCalendarList = createAction(
  '[Sidebar Page] Load Google calendar list',
  props<{ uuidAccount: string }>()
);
