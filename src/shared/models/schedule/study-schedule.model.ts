import { DateHelper } from '@shared/helpers';
import { EjsScheduleModel } from './ejs-schedule.model';
import { FixedScheduleModel } from './fixed-schedule.model';
import { ScheduleModel } from './schedule.model';

export class StudyScheduleModel extends ScheduleModel {
  public shift!: string;
  public date!: Date;
  public readonly color!: string;
  public readonly moduleName!: string;
  public readonly teacher!: string;
  public fixedSchedules!: FixedScheduleModel[];

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
    fixedSchedules: FixedScheduleModel[]
  ) {
    super(id, idModuleClass, name, idRoom, 'study', note, [teacher]);

    this.teacher = teacher;
    this.shift = shift;
    this.date = date;
    this.color = color;
    this.moduleName = moduleName;
    this.fixedSchedules = fixedSchedules;
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
      obj.fixedSchedules
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
      FixedSchedules: this.fixedSchedules,
    };
  }
}
