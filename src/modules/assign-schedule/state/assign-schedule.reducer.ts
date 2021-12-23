import { createReducer, on } from '@ngrx/store';
import { AssignScheduleState } from '.';
import * as ApiAction from './assign-schedule.api.actions';

const initialState: AssignScheduleState = {
  schoolYears: [],
  academicYears: {},
};

export const assignScheduleFeatureKey = 'assign-schedule';

export const assignScheduleReducer = createReducer(
  initialState,
  on(ApiAction.loadSchoolYearSuccessful, (state, { schoolYears }) => {
    return {
      ...state,
      schoolYears,
    };
  }),
  on(ApiAction.loadAcademicYearSuccessful, (state, { academicYears }) => {
    return {
      ...state,
      academicYears,
    };
  })
);
