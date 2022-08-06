import { SimpleModel } from '../core';
import { EjsScheduleModel } from './ejs-schedule.model';

type ScheduleType = 'exam' | 'study';

export abstract class ScheduleModel {
  constructor(
    public readonly id: number,
    public readonly idModuleClass: string,
    public readonly name: string,
    public idRoom: string,
    public readonly type: ScheduleType,
    public note: string,
    public readonly people?: string[] | SimpleModel[]
  ) {}

  abstract toEjsSchedule(): EjsScheduleModel;
}
