import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from '@shared/enums';
import { StudyEditorDialogState } from '.';
import * as ApiAction from './study-editor-dialog.api.actions';
import * as PageAction from './study-editor-dialog.page.actions';

const initialState: StudyEditorDialogState = {
  changeStatus: EApiStatus.unknown,
  requestStatus: EApiStatus.unknown,
  updateStatus: EApiStatus.unknown,
  searchStatus: EApiStatus.unknown,
  cancelStatus: EApiStatus.unknown,
  requestingChangeSchedule: false,
  justRequestedSchedule: null,
  change: {
    note: '',
  },
  searchSchedule: null,
};

export const studyEditorDialogFeatureKey = 'studyEditorDialog';

export const studyEditorDialogReducer = createReducer(
  initialState,
  on(PageAction.reset, (_, { change }) => ({ ...initialState, change })),
  on(PageAction.change, (state) => ({
    ...state,
    changeStatus: EApiStatus.loading,
  })),
  on(PageAction.request, (state) => ({
    ...state,
    requestStatus: EApiStatus.loading,
  })),
  on(PageAction.update, (state) => ({
    ...state,
    updateStatus: EApiStatus.loading,
  })),
  on(PageAction.search, (state) => ({
    ...state,
    searchStatus: EApiStatus.loading,
  })),
  on(PageAction.cancel, (state) => ({
    ...state,
    cancelStatus: EApiStatus.loading,
  })),
  on(PageAction.toggleRequestChange, (state, { open }) => ({
    ...state,
    requestingChangeSchedule: open,
  })),
  on(ApiAction.changeSuccessful, (state) => ({
    ...state,
    changeStatus: EApiStatus.successful,
    requestingChangeSchedule: false,
  })),
  on(ApiAction.changeFailure, (state) => ({
    ...state,
    changeStatus: EApiStatus.systemError,
    requestingChangeSchedule: false,
  })),
  on(ApiAction.requestSuccessful, (state, { justRequestedSchedule }) => ({
    ...state,
    justRequestedSchedule,
    requestStatus: EApiStatus.successful,
    requestingChangeSchedule: false,
  })),
  on(ApiAction.requestFailure, (state) => ({
    ...state,
    requestStatus: EApiStatus.systemError,
    requestingChangeSchedule: false,
  })),
  on(ApiAction.updateSuccessful, (state, { change }) => ({
    ...state,
    updateStatus: EApiStatus.successful,
    change,
  })),
  on(ApiAction.updateFailure, (state) => ({
    ...state,
    updateStatus: EApiStatus.systemError,
  })),
  on(ApiAction.searchSuccessful, (state, { searchSchedule }) => ({
    ...state,
    searchStatus: EApiStatus.successful,
    searchSchedule,
  })),
  on(ApiAction.searchFailure, (state) => ({
    ...state,
    searchStatus: EApiStatus.systemError,
  })),
  on(ApiAction.cancelSuccessful, (state) => ({
    ...state,
    justRequestedSchedule: null,
    cancelStatus: EApiStatus.successful,
  })),
  on(ApiAction.cancelFailure, (state) => ({
    ...state,
    cancelStatus: EApiStatus.systemError,
  }))
);
