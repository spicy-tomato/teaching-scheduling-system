import { EApiStatus } from '@shared/enums';
import { Nullable, SimpleFixedScheduleModel } from 'src/shared/models';

export type Change = {
  note: string;
};

export interface StudyEditorDialogState {
  requestStatus: EApiStatus;
  updateStatus: EApiStatus;
  requestingChangeSchedule: boolean;
  justRequestedSchedule: Nullable<SimpleFixedScheduleModel>;
  change: Change;
}
