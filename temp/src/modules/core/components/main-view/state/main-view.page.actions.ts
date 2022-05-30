import { createAction, props } from '@ngrx/store';
import { BreadcrumbItem } from 'src/shared/models';

export const update = createAction(
  '[Main view] Update breadcrumb',
  props<{ breadcrumbs: BreadcrumbItem[] }>()
);
