import { EjsScheduleModel } from './ejs-schedule.model';
import { ScheduleModel } from './schedule.model';

export class ExamScheduleModel extends ScheduleModel {
  constructor(
    id: number,
    idModuleClass: string,
    name: string,
    public readonly method: string,
    public readonly timeStart: Date,
    public readonly timeEnd: Date,
    idRoom: string,
    note: string,
    public readonly teacher: string
  ) {
    super(id, idModuleClass, name, idRoom, 'exam', note, [teacher]);
  }

  public static parse(obj: ExamScheduleModel): ExamScheduleModel {
    return new ExamScheduleModel(
      obj.id,
      obj.idModuleClass,
      obj.name,
      obj.method,
      obj.timeStart,
      obj.timeEnd,
      obj.idRoom,
      obj.note,
      obj.teacher
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
