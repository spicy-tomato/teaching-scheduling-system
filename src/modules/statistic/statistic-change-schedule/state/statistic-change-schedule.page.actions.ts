import { createAction, props } from '@ngrx/store';
import { TuiDayRange } from '@taiga-ui/cdk';

export const reset = createAction('[Statistic - Change Schedule Page] Reset');

export const statisticize = createAction(
  '[Statistic - Change Schedule Page] Statisticize',
  props<{ range: TuiDayRange }>()
);

export const loadTeacherList = createAction(
  '[Statistic - Change Schedule Page] Load teacher list'
);
