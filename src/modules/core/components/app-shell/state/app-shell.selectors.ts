import { createFeatureSelector, createSelector } from '@ngrx/store';
import { appShellFeatureKey } from './app-shell.reducer';
import { AppShellState } from './app-shell.state';

const appShellSelector =
  createFeatureSelector<AppShellState>(appShellFeatureKey);

export const selectTeacher = createSelector(
  appShellSelector,
  (state) => state.teacher
);
