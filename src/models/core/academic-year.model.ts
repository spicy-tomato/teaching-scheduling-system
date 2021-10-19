import { AcademicYearDta } from "src/dtas/academic-year.dta";

export class AcademicYear {
  public id!: string;
  public name!: string;

  public static parse(obj: AcademicYearDta): AcademicYear {
    return ({
      id: obj.id_academic_year,
      name: obj.academic_year,
    });
  }
}
