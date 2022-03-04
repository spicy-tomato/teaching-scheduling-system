import { createAction, props } from '@ngrx/store';
import { ChangeSchedule } from 'src/shared/models';

export const statisticizeSuccessful = createAction(
  '[Statistic - Change Schedule API] Statisticize Successfully',
  props<{ changeSchedules: ChangeSchedule[] }>()
);

export const statisticizeFailure = createAction(
  '[Statistic - Change Schedule API] Statisticize Failed'
);
