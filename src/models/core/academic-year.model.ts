import { AcademicYearDta } from "src/dtas/academic-year.dta";

export class AcademicYear {
  public readonly id!: string;
  public readonly name!: string;

  public static parse(obj: AcademicYearDta): AcademicYear {
    return ({
      id: obj.id_academic_year,
      name: obj.academic_year,
    });
  }
}
