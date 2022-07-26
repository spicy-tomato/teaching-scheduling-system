import { SimpleModel } from '../simple.model';

export class Teacher {
  public readonly uuidAccount!: string;
  public readonly birth?: string;
  public readonly phone?: string;
  public readonly universityTeacherDegree?: string;
  public readonly email?: string;
  public readonly department?: SimpleModel;
  public readonly faculty!: SimpleModel;
  public readonly id!: string;
  public readonly idRole!: number;
  public readonly name!: string;
  public readonly scheduleDataVersion!: number;
  public readonly notificationDataVersion!: number;
  public readonly isFemale!: boolean;
  public readonly permissions!: number[];
}
