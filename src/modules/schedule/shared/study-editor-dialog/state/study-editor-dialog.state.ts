import { EApiStatus } from '@shared/enums';
import {
  Nullable,
  SimpleFixedScheduleModel,
  StudyScheduleModel,
} from 'src/shared/models';

export type Change = {
  note: string;
};

export interface StudyEditorDialogState {
  requestStatus: EApiStatus;
  updateStatus: EApiStatus;
  searchStatus: EApiStatus;
  cancelStatus: EApiStatus;
  requestingChangeSchedule: boolean;
  justRequestedSchedule: Nullable<SimpleFixedScheduleModel>;
  change: Change;
  searchSchedule: Nullable<StudyScheduleModel[]>;
}
