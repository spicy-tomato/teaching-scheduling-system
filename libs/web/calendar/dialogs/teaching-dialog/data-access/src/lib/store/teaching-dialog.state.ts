import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  SimpleFixedScheduleModel,
  StudyScheduleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';

export type TeachingDialogChange = {
  note: string;
};

export interface TeachingDialogState {
  changeStatus: EApiStatus;
  requestStatus: EApiStatus;
  updateStatus: EApiStatus;
  searchStatus: EApiStatus;
  cancelStatus: EApiStatus;
  requestingChangeSchedule: boolean;
  justRequestedSchedule: Nullable<SimpleFixedScheduleModel>;
  change: TeachingDialogChange;
  searchSchedule: Nullable<StudyScheduleModel[]>;
}
