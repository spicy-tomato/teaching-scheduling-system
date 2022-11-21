import { createAction, props } from '@ngrx/store';
import { View } from '@syncfusion/ej2-angular-schedule';
import { TuiMonth } from '@taiga-ui/cdk';
import { CalendarFilter } from '@teaching-scheduling-system/web/shared/data-access/models';

export const calendarReset = createAction('[Calendar Page] Reset');

export const calendarLoad = createAction(
  '[Calendar Page] Load',
  props<{ date: Date }>()
);

export const calendarPrev = createAction(
  '[Calendar Page] Prev',
  props<{ oldSelectedDate: Date }>()
);

export const calendarNext = createAction(
  '[Calendar Page] Next',
  props<{ oldSelectedDate: Date }>()
);

export const calendarChangeMonth = createAction(
  '[Calendar Page] Choose Month',
  props<{ month: TuiMonth }>()
);

export const calendarChangeView = createAction(
  '[Calendar Page] Change View',
  props<{ view: View }>()
);

export const calendarFilter = createAction('[Calendar Page] Filter');

export const calendarResetFilter = createAction('[Calendar Page] Reset Filter');

export const calendarChangeSelectingState = createAction(
  '[Calendar Page] Change selecting type',
  props<{ changes: Partial<CalendarFilter> }>()
);
