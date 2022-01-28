import { DateHelper } from '@shared/helpers';
import { EjsScheduleModel } from './ejs-schedule.model';
import { ScheduleModel } from './schedule.model';

export class StudyScheduleModel extends ScheduleModel {
  public readonly shift!: string;
  public readonly date!: Date;
  public readonly color!: string;
  public readonly moduleName!: string;
  public readonly teacher!: string;
  public readonly fixedSchedule!: {
    id_schedule: number;
    new_date: string;
    new_shift: string;
    new_id_room: string;
  }[];

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
    fixedSchedule: {
      id_schedule: number;
      new_date: string;
      new_shift: string;
      new_id_room: string;
    }[]
  ) {
    super(id, idModuleClass, name, idRoom, 'study', note, [teacher]);

    this.shift = shift;
    this.date = date;
    this.color = color;
    this.moduleName = moduleName;
    this.fixedSchedule = fixedSchedule;
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
      obj.fixedSchedule
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
      FixedSchedule: this.fixedSchedule.map((x) => ({
        IdSchedule: x.id_schedule,
        NewDate: x.new_date,
        NewIdRoom: x.new_id_room,
        NewShift: x.new_shift,
      })),
    };
  }
}
