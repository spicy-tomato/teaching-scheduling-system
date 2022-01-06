import { createFeatureSelector, createSelector } from '@ngrx/store';
import { appShellFeatureKey } from './app-shell.reducer';
import { AppShellState } from './app-shell.state';

const appShellSelector =
  createFeatureSelector<AppShellState>(appShellFeatureKey);

export const selectTeacher = createSelector(
  appShellSelector,
  (state) => state.teacher
);

export const selectNameTitle = createSelector(selectTeacher, (teacher) =>
  teacher === undefined ? 'Bạn' : teacher.isFemale ? 'Cô' : 'Thầy'
);

export const selectPermission = createSelector(
  selectTeacher,
  (teacher) => teacher?.permissions
);

export const selectDepartment = createSelector(
  selectTeacher,
  (teacher) => teacher?.idDepartment
);

export const selectRooms = createSelector(
  appShellSelector,
  (state) => state.rooms
);
