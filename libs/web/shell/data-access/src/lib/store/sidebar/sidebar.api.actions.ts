import { createAction, props } from '@ngrx/store';
import { SidebarField } from './sidebar.model.store';

export const setDataState = createAction(
  '[Sidebar API] Set data state',
  props<{ dataState: Record<SidebarField, boolean> }>()
);
