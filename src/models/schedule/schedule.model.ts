import { ScheduleDta } from 'src/dtas/schedule.dta';
import { EjsScheduleModel } from './ejs-schedule.model';

type ScheduleType = 'exam' | 'study';

export class ScheduleModel {
  public readonly idModuleClass!: string;
  public readonly name!: string;
  public readonly method!: string;
  public readonly timeStart!: Date;
  public readonly timeEnd!: Date;
  public readonly idRoom!: string;
  public readonly type!: ScheduleType;

  constructor(
    idModuleClass: string,
    name: string,
    method: string,
    timeStart: Date,
    timeEnd: Date,
    idRoom: string,
    type: ScheduleType
  ) {
    this.idModuleClass = idModuleClass;
    this.name = name;
    this.method = method;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this.idRoom = idRoom;
    this.type = type;
  }

  public static parse(
    obj: ScheduleDta,
    type: ScheduleType = 'study'
  ): ScheduleModel {
    return new ScheduleModel(
      obj.id_module_class,
      obj.name,
      obj.method,
      new Date(obj.time_start),
      new Date(obj.time_end),
      obj.id_room,
      type
    );
  }

  public toEjsSchedule(): EjsScheduleModel {
    return {
      Subject: this.name,
      StartTime: this.timeStart,
      EndTime: this.timeEnd,
      Location: this.idRoom,
      Type: this.type,
      IdModuleClass: this.idModuleClass
    };
  }
}
