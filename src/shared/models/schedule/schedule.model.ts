import { SimpleModel } from '../core';
import { EjsScheduleModel } from './ejs-schedule.model';

type ScheduleType = 'exam' | 'study';

export abstract class ScheduleModel {
  public readonly id!: number;
  public readonly idModuleClass!: string;
  public readonly name!: string;
  public readonly idRoom!: string;
  public readonly type!: ScheduleType;
  public readonly note!: string;
  public readonly people?: string[] | SimpleModel[];

  constructor(
    id: number,
    idModuleClass: string,
    name: string,
    idRoom: string,
    type: ScheduleType,
    note: string,
    people?: string[]
  ) {
    this.id = id;
    this.idModuleClass = idModuleClass;
    this.name = name;
    this.idRoom = idRoom;
    this.type = type;
    this.note = note;
    this.people = people;
  }

  public abstract toEjsSchedule(): EjsScheduleModel;
}
