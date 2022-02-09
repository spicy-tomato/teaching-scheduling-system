import { DateHelper } from '@shared/helpers';
import { EjsScheduleModel } from './ejs-schedule.model';
import { FixedScheduleModel } from './fixed-schedule.model';
import { ScheduleModel } from './schedule.model';

export class StudyScheduleModel extends ScheduleModel {
  public readonly shift!: string;
  public readonly date!: Date;
  public readonly color!: string;
  public readonly moduleName!: string;
  public readonly teacher!: string;
  public readonly from!: FixedScheduleModel;
  public readonly to!: FixedScheduleModel;

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
    teacher: string,
    from: FixedScheduleModel,
    to: FixedScheduleModel
  ) {
    super(id, idModuleClass, name, idRoom, 'study', note, [teacher]);

    this.shift = shift;
    this.date = date;
    this.color = color;
    this.moduleName = moduleName;
    this.from = from;
    this.to = to;
  }

  public static parse(obj: StudyScheduleModel): StudyScheduleModel {
    return new StudyScheduleModel(
      obj.id,
      obj.idModuleClass,
      obj.name,
      obj.idRoom,
      obj.note,
      obj.shift,
      obj.date,
      obj.color,
      obj.moduleName,
      obj.teacher,
      obj.from,
      obj.to
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
      From: this.from,
      To: this.to,
    };
  }
}
