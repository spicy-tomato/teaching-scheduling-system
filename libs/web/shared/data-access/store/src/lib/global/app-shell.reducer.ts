import { createReducer, on } from '@ngrx/store';
import { AppShellState } from '.';
import * as ApiAction from './app-shell.api.actions';
import * as PageAction from './app-shell.page.actions';

const initialState: AppShellState = {
  currentTerm: '',
  breadcrumbs: [],
  academicData: [],
  teacher: null,
  status: 'unknown',
  rooms: [],
  teachersInDepartment: [],
  showLoader: null,
};

export const appShellFeatureKey = 'app-shell';

export const appShellReducer = createReducer(
  initialState,
  on(PageAction.reset, () => initialState),
  on(PageAction.keepLogin, (state) => ({
    ...state,
    status: 'loading',
  })),
  on(PageAction.setLoader, (state, { showLoader }) => ({
    ...state,
    showLoader,
  })),
  on(ApiAction.updateBreadcrumbs, (state, { breadcrumbs }) => ({
    ...state,
    breadcrumbs,
  })),
  on(ApiAction.autoLoginSuccessfully, (state, { teacher }) => ({
    ...state,
    teacher,
    status: 'successful',
  })),
  on(ApiAction.autoLoginFailure, (state) => ({
    ...state,
    teacher: null,
    status: 'clientError',
  })),
  on(ApiAction.loadRoomsSuccessfully, (state, { rooms }) => ({
    ...state,
    rooms,
  })),
  on(ApiAction.loadCurrentTermSuccessful, (state, { currentTerm }) => {
    return {
      ...state,
      currentTerm,
    };
  }),
  on(ApiAction.loadAcademicYearSuccessful, (state, { academicYears }) => {
    return {
      ...state,
      academicData: academicYears,
    };
  }),
  on(ApiAction.loadTeachersInDepartmentSuccessful, (state, { teachers }) => {
    return {
      ...state,
      teachersInDepartment: teachers,
    };
  })
);
