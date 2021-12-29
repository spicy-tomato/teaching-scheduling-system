import { ScheduleFilter } from '@models/schedule/schedule-filter.model';
import { createAction, props } from '@ngrx/store';
import { View } from '@syncfusion/ej2-angular-schedule';
import { TuiMonth } from '@taiga-ui/cdk';

export const reset = createAction('[Schedule Page] Reset');

export const load = createAction('[Schedule Page] Load');

export const loadDepartmentSchedule = createAction(
  '[Schedule Page] Load department schedule'
);

export const prev = createAction(
  '[Schedule Page] Prev',
  props<{ oldSelectedDate: Date }>()
);

export const next = createAction(
  '[Schedule Page] Next',
  props<{ oldSelectedDate: Date }>()
);

export const changeMonth = createAction(
  '[Schedule Page] Choose Month',
  props<{ month: TuiMonth }>()
);

export const changeView = createAction(
  '[Schedule Page] Change View',
  props<{ view: View }>()
);

export const filter = createAction(
  '[Schedule Page] Filter',
  props<{ filter: ScheduleFilter }>()
);
