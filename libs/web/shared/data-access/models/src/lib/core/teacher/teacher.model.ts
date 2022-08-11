import { SimpleModel } from '../simple.model';

export class Teacher {
  readonly uuidAccount!: string;
  readonly birth?: string;
  readonly phone?: string;
  readonly universityTeacherDegree?: string;
  readonly email?: string;
  readonly department?: SimpleModel;
  readonly faculty!: SimpleModel;
  readonly id!: string;
  readonly idRole!: number;
  readonly name!: string;
  readonly scheduleDataVersion!: number;
  readonly notificationDataVersion!: number;
  readonly isFemale!: boolean;
  readonly permissions!: number[];
  readonly tags!: string[]
}
