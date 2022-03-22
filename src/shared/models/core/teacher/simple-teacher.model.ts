import { SimpleModel } from '../simple.model';

export class SimpleTeacher {
  public readonly birth?: string;
  public readonly universityTeacherDegree?: string;
  public readonly department!: SimpleModel;
  public readonly faculty!: SimpleModel;
  public readonly id!: string;
  public readonly name!: string;
  public readonly isFemale!: boolean;
}
