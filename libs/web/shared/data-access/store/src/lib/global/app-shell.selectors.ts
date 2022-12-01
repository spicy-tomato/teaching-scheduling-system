import { createFeatureSelector, createSelector, select } from '@ngrx/store';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { pipe } from 'rxjs';
import { appShellFeatureKey } from './app-shell.reducer';
import { AppShellState } from './app-shell.state';

const appShellSelector =
  createFeatureSelector<AppShellState>(appShellFeatureKey);

export const selectBreadcrumbs = createSelector(
  appShellSelector,
  (state) => state.breadcrumbs
);

export const selectStatus = createSelector(
  appShellSelector,
  (state) => state.status
);

export const selectTeacher = createSelector(
  appShellSelector,
  (state) => state.teacher
);

export const selectNotNullTeacher = pipe(
  select(selectTeacher),
  ObservableHelper.filterNullish()
);

export const selectNameTitle = createSelector(selectTeacher, (teacher) =>
  teacher === null ? 'Bạn' : teacher.isFemale ? 'Cô' : 'Thầy'
);

export const selectPermission = createSelector(
  selectTeacher,
  (teacher) => teacher?.permissions || []
);

export const selectDepartment = createSelector(
  selectTeacher,
  (teacher) => teacher?.department || null
);

export const selectFaculty = createSelector(
  selectTeacher,
  (teacher) => teacher?.faculty || null
);

export const selectRooms = createSelector(
  appShellSelector,
  (state) => state.rooms
);

export const selectSchoolYear = createSelector(
  appShellSelector,
  (state) => state.currentTerm
);

export const selectAcademicData = createSelector(
  appShellSelector,
  (state) => state.academicData
);

export const selectTrainingTypes = createSelector(
  selectAcademicData,
  (academicData) => academicData.map(({ name }, i) => ({ name, id: i }))
);

export const selectTeachersInDepartment = createSelector(
  appShellSelector,
  (state) => state.teachersInDepartment
);

export const selectShowLoader = createSelector(
  appShellSelector,
  selectStatus,
  ({ showLoader }, status) => {
    if (showLoader !== null) {
      return showLoader;
    }
    return status === 'loading' || status === 'unknown';
  }
);
