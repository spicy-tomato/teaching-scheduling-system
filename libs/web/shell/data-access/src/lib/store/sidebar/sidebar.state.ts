import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { SidebarEvent, SidebarField } from './sidebar.model.store';

export interface SidebarState {
  event: Nullable<SidebarEvent>;
  dataState: Record<SidebarField, boolean>;
}
