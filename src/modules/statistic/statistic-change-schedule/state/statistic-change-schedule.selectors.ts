import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  statisticChangeScheduleFeatureKey,
  StatisticChangeScheduleState,
} from '.';

const statisticChangeScheduleSelector =
  createFeatureSelector<StatisticChangeScheduleState>(
    statisticChangeScheduleFeatureKey
  );

export const selectStatus = createSelector(
  statisticChangeScheduleSelector,
  (state) => state.status
);

export const selectChangeSchedules = createSelector(
  statisticChangeScheduleSelector,
  (state) => state.changeSchedules
);
