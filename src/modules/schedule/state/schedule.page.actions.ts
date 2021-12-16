import { createAction, props } from '@ngrx/store';

export const load = createAction(
  '[Schedule Page] Load',
  props<{ departmentSchedule: boolean }>()
);
