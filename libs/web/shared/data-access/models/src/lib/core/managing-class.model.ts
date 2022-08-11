import { ManagingClassDta } from '@teaching-scheduling-system/web/shared/data-access/dta';

export class ManagingClass {
  readonly academicYear!: number;
  readonly name!: string;
  readonly faculty!: string;

  static parse(obj: ManagingClassDta): ManagingClass {
    return {
      academicYear: obj.id_academic_year,
      name: obj.id_class,
      faculty: obj.id_faculty,
    };
  }
}
