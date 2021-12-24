import { createReducer, on } from '@ngrx/store';
import { AssignScheduleState } from '.';
import * as ApiAction from './assign-schedule.api.actions';

const initialState: AssignScheduleState = {
  currentTerm: '',
  academicYears: {},
};

export const assignScheduleFeatureKey = 'assign-schedule';

export const assignScheduleReducer = createReducer(
  initialState,
  on(ApiAction.loadCurrentTermSuccessful, (state, { currentTerm }) => {
    return {
      ...state,
      currentTerm,
    };
  }),
  on(ApiAction.loadAcademicYearSuccessful, (state, { academicYears }) => {
    return {
      ...state,
      academicYears,
    };
  })
);
