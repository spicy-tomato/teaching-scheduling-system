import { createReducer, on } from '@ngrx/store';
import { StringHelper } from '@teaching-scheduling-system/core/utils/helpers';
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
  googleCalendars: [],
};

export const appShellFeatureKey = 'app-shell';

export const appShellReducer = createReducer(
  initialState,
  on(PageAction.reset, () => initialState),
  on(PageAction.keepLogin, (state) => ({
    ...state,
    status: 'loading',
  })),
  on(PageAction.logout, (state) => ({
    ...state,
    teacher: null,
    teachersInDepartment: [],
  })),
  on(PageAction.setLoader, (state, { showLoader }) => ({
    ...state,
    showLoader,
  })),
  on(PageAction.setConnectToGoogle, (state, { connect }) => ({
    ...state,
    teacher: {
      ...state.teacher!,
      settings: {
        ...state.teacher!.settings,
        googleCalendar: connect,
      },
    },
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
    const teachersInDepartment = [...teachers];
    teachersInDepartment.sort((a, b) =>
      StringHelper.nameCompareFn(a.name, b.name)
    );
    return {
      ...state,
      teachersInDepartment,
    };
  }),
  on(ApiAction.loadGoogleCalendarSuccessful, (state, { calendars }) => {
    return {
      ...state,
      googleCalendars: calendars,
    };
  })
);
