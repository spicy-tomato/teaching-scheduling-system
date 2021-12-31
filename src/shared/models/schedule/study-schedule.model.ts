import { StudyScheduleDta } from '@shared/dtas';
import { DateHelper } from '@shared/helpers';
import { EjsScheduleModel } from './ejs-schedule.model';
import { ScheduleModel } from './schedule.model';

export class StudyScheduleModel extends ScheduleModel {
  public readonly shift!: string;
  public readonly date!: Date;
  public readonly color!: string;
  public readonly moduleName!: string;

  constructor(
    id: number,
    idModuleClass: string,
    name: string,
    idRoom: string,
    note: string,
    shift: string,
    date: Date,
    color: string,
    moduleName: string,
    people?: string
  ) {
    super(
      id,
      idModuleClass,
      name,
      idRoom,
      'study',
      note,
      people ? [people] : []
    );

    this.shift = shift;
    this.date = date;
    this.color = color;
    this.moduleName = moduleName;
  }

  public static parse(obj: StudyScheduleDta): StudyScheduleModel {
    return new StudyScheduleModel(
      obj.id,
      obj.id_module_class,
      obj.name,
      obj.id_room,
      obj.note,
      obj.shift,
      new Date(obj.date),
      obj.color,
      obj.module_name,
      obj.teacher
    );
  }

  public toEjsSchedule(): EjsScheduleModel {
    const [start, end] = DateHelper.fromShift(this.date, this.shift);

    return {
      Id: this.id,
      Subject: this.name,
      StartTime: start,
      EndTime: end,
      Location: this.idRoom,
      Type: this.type,
      IdModuleClass: this.idModuleClass,
      ModuleName: this.moduleName,
      Note: this.note,
      People: this.people,
      Color: this.color,
      Shift: this.shift,
    };
  }
}
