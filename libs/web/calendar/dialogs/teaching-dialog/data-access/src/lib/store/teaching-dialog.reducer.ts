import { createReducer, on } from '@ngrx/store';
import { TeachingDialogState } from '.';
import * as ApiAction from './teaching-dialog.api.actions';
import * as PageAction from './teaching-dialog.page.actions';

const initialState: TeachingDialogState = {
  changeStatus: 'unknown',
  requestStatus: 'unknown',
  updateStatus: 'unknown',
  searchStatus: 'unknown',
  cancelStatus: 'unknown',
  requestingChangeSchedule: false,
  justRequestedSchedule: null,
  change: {
    note: '',
  },
  searchSchedule: null,
};

export const teachingDialogFeatureKey = 'studyEditorDialog';

export const teachingDialogReducer = createReducer(
  initialState,
  on(PageAction.teachingDialogReset, (_, { change }) => ({
    ...initialState,
    change,
  })),
  on(PageAction.teachingDialogChange, (state) => ({
    ...state,
    changeStatus: 'loading',
  })),
  on(PageAction.teachingDialogRequest, (state) => ({
    ...state,
    requestStatus: 'loading',
  })),
  on(PageAction.teachingDialogRequestIntend, (state) => ({
    ...state,
    requestStatus: 'loading',
  })),
  on(PageAction.teachingDialogUpdate, (state) => ({
    ...state,
    updateStatus: 'loading',
  })),
  on(PageAction.teachingDialogSearch, (state) => ({
    ...state,
    searchStatus: 'loading',
  })),
  on(PageAction.teachingDialogCancel, (state) => ({
    ...state,
    cancelStatus: 'loading',
  })),
  on(PageAction.teachingDialogToggleRequestChange, (state, { open }) => ({
    ...state,
    requestingChangeSchedule: open,
  })),
  on(ApiAction.changeSuccessful, (state) => ({
    ...state,
    changeStatus: 'successful',
    requestingChangeSchedule: false,
  })),
  on(ApiAction.changeFailure, (state) => ({
    ...state,
    changeStatus: 'systemError',
    requestingChangeSchedule: false,
  })),
  on(ApiAction.requestSuccessful, (state, { justRequestedSchedule }) => ({
    ...state,
    justRequestedSchedule,
    requestStatus: 'successful',
    requestingChangeSchedule: false,
  })),
  on(ApiAction.requestIntendSuccessful, (state, { justRequestedSchedule }) => ({
    ...state,
    justRequestedSchedule,
    requestStatus: 'successful',
    requestingChangeSchedule: false,
  })),
  on(ApiAction.requestFailure, (state) => ({
    ...state,
    requestStatus: 'systemError',
    requestingChangeSchedule: false,
  })),
  on(ApiAction.updateSuccessful, (state, { change }) => ({
    ...state,
    updateStatus: 'successful',
    change,
  })),
  on(ApiAction.updateFailure, (state) => ({
    ...state,
    updateStatus: 'systemError',
  })),
  on(ApiAction.searchSuccessful, (state, { searchSchedule }) => ({
    ...state,
    searchStatus: 'successful',
    searchSchedule,
  })),
  on(ApiAction.searchFailure, (state) => ({
    ...state,
    searchStatus: 'systemError',
  })),
  on(ApiAction.cancelSuccessful, (state) => ({
    ...state,
    justRequestedSchedule: null,
    cancelStatus: 'successful',
  })),
  on(ApiAction.cancelFailure, (state) => ({
    ...state,
    cancelStatus: 'systemError',
  }))
);
