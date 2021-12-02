import { TeacherDta } from 'src/dtas/teacher.dta';

export class Teacher {
  public readonly id!: string;
  public readonly birth?: string;
  public readonly phoneNumber?: string;
  public readonly universityTeacherDegree?: string;
  public readonly email?: string;
  public readonly idDepartment!: string;
  public readonly idAccount!: number;
  public readonly name!: string;

  public static parse(obj: TeacherDta | null): Teacher | undefined {
    if (!obj) {
      return undefined;
    }

    return {
      ...obj,
      phoneNumber: obj.phone_number,
      universityTeacherDegree: obj.university_teacher_degree,
      idDepartment: obj.id_department,
      idAccount: obj.id_account,
    };
  }
}
