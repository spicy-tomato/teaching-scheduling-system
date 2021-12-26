import { SearchSchedule } from '@models/schedule/search-schedule.model';
import { createAction, props } from '@ngrx/store';

export const loadSchoolYear = createAction(
  '[Assign Schedule Page] Load school year'
);

export const loadAcademicYear = createAction(
  '[Assign Schedule Page] Load academic year'
);

export const filter = createAction(
  '[Assign Schedule Page] Filter',
  props<{ dep: string; params: SearchSchedule }>()
);
