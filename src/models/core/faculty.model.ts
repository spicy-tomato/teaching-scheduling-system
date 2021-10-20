import { FacultyDta } from "src/dtas/faculty.dta";

export class Faculty {
  public readonly id!: string;
  public readonly name!: string;

  public static parse(obj: FacultyDta): Faculty {
    return ({
      id: obj.id_faculty,
      name: obj.faculty_name,
    });
  }
}
