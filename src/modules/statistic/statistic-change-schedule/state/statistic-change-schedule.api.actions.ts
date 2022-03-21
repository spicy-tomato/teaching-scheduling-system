import { createAction, props } from '@ngrx/store';
import { ChangeSchedule, SimpleModel } from 'src/shared/models';

export const statisticizeSuccessful = createAction(
  '[Statistic - Change Schedule API] Statisticize Successfully',
  props<{ changeSchedules: ChangeSchedule[] }>()
);

export const statisticizeFailure = createAction(
  '[Statistic - Change Schedule API] Statisticize Failed'
);

export const loadTeacherListSuccessful = createAction(
  '[Statistic - Change Schedule API] Load teacher list Successfully',
  props<{ teachersList: SimpleModel[] }>()
);

export const loadTeacherListFailure = createAction(
  '[Statistic - Change Schedule API] Load teacher list Failed'
);
