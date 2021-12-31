import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from '@shared/enums';
import { FeedbackState } from '.';
import * as ApiAction from './feedback.api.actions';
import * as PageAction from './feedback.page.actions';

const initialState: FeedbackState = {
  status: EApiStatus.unknown,
};

export const feedbackFeatureKey = 'feedback';

export const feedbackReducer = createReducer(
  initialState,
  on(PageAction.reset, () => initialState),
  on(PageAction.submit, (state) => ({
    ...state,
    status: EApiStatus.loading,
  })),
  on(ApiAction.submitSuccessful, (state) => {
    return {
      ...state,
      status: EApiStatus.successful,
    };
  }),
  on(ApiAction.submitFailure, (state) => ({
    ...state,
    status: EApiStatus.clientError,
  }))
);
