import { TeacherDta } from '@shared/dtas';
import { Nullable } from './nullable.model';
import { SimpleModel } from './simple.model';

export class Teacher {
  public readonly uuid!: string;
  public readonly uuidAccount!: string;
  public readonly birth?: string;
  public readonly phoneNumber?: string;
  public readonly universityTeacherDegree?: string;
  public readonly email?: string;
  public readonly department!: SimpleModel;
  public readonly faculty!: SimpleModel;
  public readonly idAccount!: number;
  public readonly name!: string;
  public readonly scheduleDataVersion!: number;
  public readonly notificationDataVersion!: number;
  public readonly isFemale!: boolean;
  public readonly permissions!: number[];

  public static parse(obj?: TeacherDta): Nullable<Teacher> {
    if (!obj) {
      return null;
    }

    return {
      ...obj,
      uuidAccount: obj.uuid_account,
      phoneNumber: obj.phone_number,
      universityTeacherDegree: obj.university_teacher_degree,
      department: obj.department,
      faculty: obj.faculty,
      idAccount: obj.id_account,
      scheduleDataVersion: obj.schedule_data_version,
      notificationDataVersion: obj.notification_data_version,
      isFemale: !!obj.is_female,
    };
  }
}
