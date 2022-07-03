import { createReducer, on } from '@ngrx/store';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import { TeachingDialogState } from '.';
import * as ApiAction from './teaching-dialog.api.actions';
import * as PageAction from './teaching-dialog.page.actions';

const initialState: TeachingDialogState = {
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

export const teachingDialogFeatureKey = 'studyEditorDialog';

export const teachingDialogReducer = createReducer(
  initialState,
  on(PageAction.teachingDialogReset, (_, { change }) => ({ ...initialState, change })),
  on(PageAction.teachingDialogChange, (state) => ({
    ...state,
    changeStatus: EApiStatus.loading,
  })),
  on(PageAction.teachingDialogRequest, (state) => ({
    ...state,
    requestStatus: EApiStatus.loading,
  })),
  on(PageAction.teachingDialogRequestIntend, (state) => ({
    ...state,
    requestStatus: EApiStatus.loading,
  })),
  on(PageAction.teachingDialogUpdate, (state) => ({
    ...state,
    updateStatus: EApiStatus.loading,
  })),
  on(PageAction.teachingDialogSearch, (state) => ({
    ...state,
    searchStatus: EApiStatus.loading,
  })),
  on(PageAction.teachingDialogCancel, (state) => ({
    ...state,
    cancelStatus: EApiStatus.loading,
  })),
  on(PageAction.teachingDialogToggleRequestChange, (state, { open }) => ({
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
  on(ApiAction.requestIntendSuccessful, (state, { justRequestedSchedule }) => ({
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
