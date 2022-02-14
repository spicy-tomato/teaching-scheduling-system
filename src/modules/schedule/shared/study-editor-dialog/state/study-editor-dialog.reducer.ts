import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from '@shared/enums';
import { StudyEditorDialogState } from '.';
import * as ApiAction from './study-editor-dialog.api.actions';
import * as PageAction from './study-editor-dialog.page.actions';

const initialState: StudyEditorDialogState = {
  requestStatus: EApiStatus.unknown,
  updateStatus: EApiStatus.unknown,
  requestingChangeSchedule: false,
  justRequestedSchedule: null,
  change: {
    note: '',
  },
};

export const studyEditorDialogFeatureKey = 'studyEditorDialog';

export const studyEditorDialogReducer = createReducer(
  initialState,
  on(PageAction.reset, (_, { change }) => ({ ...initialState, change })),
  on(PageAction.request, (state) => ({
    ...state,
    requestStatus: EApiStatus.loading,
  })),
  on(PageAction.update, (state) => ({
    ...state,
    updateStatus: EApiStatus.loading,
  })),
  on(PageAction.toggleRequestChange, (state, { open }) => ({
    ...state,
    requestingChangeSchedule: open,
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
  }))
);
