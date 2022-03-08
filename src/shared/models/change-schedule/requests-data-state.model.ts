import { ChangeSchedule } from '..';
import { SimpleModel } from '../core';

export interface RequestDataState {
  changeSchedules: ChangeSchedule[];
  teachers: SimpleModel[];
}
