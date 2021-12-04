import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from 'src/enums/api-status.enum';
import { NotificationCreateState } from '.';
import * as ApiAction from './notification-create.api.actions';
import * as PageAction from './notification-create.page.actions';

const initialState: NotificationCreateState = {
  status: EApiStatus.unknown,
  managingData: {
    academicYears: [],
    faculties: [],
    classes: [],
  },
  errors: {},
};

export const notificationCreateFeatureKey = 'notification-create';

export const notificationCreateReducer = createReducer(
  initialState,
  on(PageAction.reset, () => initialState),
  on(ApiAction.loadAcademicYearsSuccessful, (state, { academicYears }) => ({
    ...state,
    managingData: {
      ...state.managingData,
      academicYears,
    },
  })),
  on(ApiAction.loadFacultiesSuccessful, (state, { faculties }) => ({
    ...state,
    managingData: {
      ...state.managingData,
      faculties,
    },
  })),
  on(ApiAction.loadManagingClassesSuccessful, (state, { classes }) => ({
    ...state,
    managingData: {
      ...state.managingData,
      classes,
    },
  })),
  on(PageAction.clickConfirm, (state) => ({
    ...state,
    status: EApiStatus.loading,
  })),
  on(ApiAction.submitFailure, (state) => ({
    ...state,
    status: EApiStatus.clientError,
  })),
  on(ApiAction.submitSuccessful, (state) => ({
    ...state,
    status: EApiStatus.successful,
  })),
  on(ApiAction.invalidForm, (state, { errors }) => ({
    ...state,
    errors,
    status: EApiStatus.clientError,
  }))
);
