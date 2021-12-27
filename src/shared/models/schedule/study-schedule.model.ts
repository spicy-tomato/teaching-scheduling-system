import { StudyScheduleDta } from 'src/shared/dtas/study-schedule.dta';
import { DateHelper } from 'src/shared/helpers/date.helper';
import { EjsScheduleModel } from './ejs-schedule.model';
import { ScheduleModel } from './schedule.model';

export class StudyScheduleModel extends ScheduleModel {
  public readonly shift!: number;
  public readonly date!: Date;

  constructor(
    id: number,
    idModuleClass: string,
    name: string,
    idRoom: string,
    note: string,
    shift: number,
    date: Date,
    people?: string[]
  ) {
    super(id, idModuleClass, name, idRoom, 'exam', note, people);

    this.shift = shift;
    this.date = date;
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
      obj.teachers
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
      Note: this.note,
      People: this.people,
    };
  }
}
