import { Nullable } from '../core';
import { EjsScheduleModel } from './ejs-schedule.model';
import { ScheduleModel } from './schedule.model';

export class ExamScheduleModel extends ScheduleModel {
  constructor(
    id: number,
    idModuleClass: string,
    name: string,
    public readonly method: string,
    public readonly startAt: Date,
    public readonly endAt: Date,
    idRoom: string,
    note: Nullable<string>,
    public teachers: string[],
    public readonly numberOfStudents: number,
    public readonly credit: number
  ) {
    super(id, idModuleClass, name, idRoom, 'exam', note ?? '', [...teachers]);
  }

  public static parse(obj: ExamScheduleModel): ExamScheduleModel {
    return new ExamScheduleModel(
      obj.id,
      obj.idModuleClass,
      obj.name,
      obj.method,
      obj.startAt,
      obj.endAt,
      obj.idRoom,
      obj.note,
      obj.teachers,
      obj.numberOfStudents,
      obj.credit
    );
  }

  public toEjsSchedule(): EjsScheduleModel {
    return {
      Id: this.id,
      Subject: `Thi ${this.name}`,
      StartTime: this.startAt,
      EndTime: this.endAt,
      Location: this.idRoom,
      Type: this.type,
      IdModuleClass: this.idModuleClass,
      Note: this.note,
      Method: this.method,
      People: this.people,
    };
  }
}
