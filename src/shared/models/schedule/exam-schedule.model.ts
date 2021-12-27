import { ExamScheduleDta } from 'src/shared/dtas/exam-schedule.dta';
import { EjsScheduleModel } from './ejs-schedule.model';
import { ScheduleModel } from './schedule.model';

export class ExamScheduleModel extends ScheduleModel {
  public readonly method!: string;
  public readonly timeStart!: Date;
  public readonly timeEnd!: Date;

  constructor(
    id: number,
    idModuleClass: string,
    name: string,
    method: string,
    timeStart: Date,
    timeEnd: Date,
    idRoom: string,
    note: string,
    people?: string[]
  ) {
    super(id, idModuleClass, name, idRoom, 'study', note, people);

    this.method = method;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
  }

  public static parse(obj: ExamScheduleDta): ExamScheduleModel {
    return new ExamScheduleModel(
      obj.id,
      obj.id_module_class,
      obj.name,
      obj.method,
      new Date(obj.time_start),
      new Date(obj.time_end),
      obj.id_room,
      obj.note,
      obj.teachers
    );
  }

  public toEjsSchedule(): EjsScheduleModel {
    return {
      Id: this.id,
      Subject: this.name,
      StartTime: this.timeStart,
      EndTime: this.timeEnd,
      Location: this.idRoom,
      Type: this.type,
      IdModuleClass: this.idModuleClass,
      Note: this.note,
      Method: this.method,
      People: this.people,
    };
  }
}
