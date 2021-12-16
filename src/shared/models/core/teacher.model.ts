import { TeacherDta } from 'src/shared/dtas/teacher.dta';

export class Teacher {
  public readonly uuid!: string;
  public readonly uuidAccount!: string;
  public readonly birth?: string;
  public readonly phoneNumber?: string;
  public readonly universityTeacherDegree?: string;
  public readonly email?: string;
  public readonly idDepartment!: string;
  public readonly idAccount!: number;
  public readonly name!: string;
  public readonly scheduleDataVersion!: number;
  public readonly notificationDataVersion!: number;
  public readonly isFemale!: boolean;
  public readonly permissions!: number[];

  public static parse(obj: TeacherDta | null): Teacher | undefined {
    if (!obj) {
      return undefined;
    }

    return {
      ...obj,
      uuidAccount: obj.uuid_account,
      phoneNumber: obj.phone_number,
      universityTeacherDegree: obj.university_teacher_degree,
      idDepartment: obj.id_department,
      idAccount: obj.id_account,
      scheduleDataVersion: obj.schedule_data_version,
      notificationDataVersion: obj.notification_data_version,
      isFemale: !!obj.is_female,
    };
  }
}
