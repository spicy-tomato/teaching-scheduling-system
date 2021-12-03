import { BreadcrumbItem } from '@models/main-view/breadcrumb-item.model';
import { createAction, props } from '@ngrx/store';

export const update = createAction(
  '[Main view] Update breadcrumb',
  props<{ breadcrumbs: BreadcrumbItem[] }>()
);
