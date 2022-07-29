import { createAction, props } from '@ngrx/store';
import { View } from '@syncfusion/ej2-angular-schedule';
import { TuiMonth } from '@taiga-ui/cdk';
import { CalendarFilter } from '@teaching-scheduling-system/web/shared/data-access/models';

export const calendarReset = createAction('[Schedule Page] Reset');

export const calendarLoad = createAction(
  '[Schedule Page] Load',
  props<{ date: Date }>()
);

export const calendarPrev = createAction(
  '[Schedule Page] Prev',
  props<{ oldSelectedDate: Date }>()
);

export const calendarNext = createAction(
  '[Schedule Page] Next',
  props<{ oldSelectedDate: Date }>()
);

export const calendarChangeMonth = createAction(
  '[Schedule Page] Choose Month',
  props<{ month: TuiMonth }>()
);

export const calendarChangeView = createAction(
  '[Schedule Page] Change View',
  props<{ view: View }>()
);

export const calendarFilter = createAction('[Schedule Page] Filter');

export const calendarResetFilter = createAction('[Schedule Page] Reset Filter');

export const calendarChangeSelectingState = createAction(
  '[Schedule Page] Change selecting type',
  props<{ changes: Partial<CalendarFilter> }>()
);
