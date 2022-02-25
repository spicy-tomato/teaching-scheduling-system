import { SimpleModel } from "@shared/models";

export interface TeacherDataDta {
  data: TeacherDta;
}

export interface TeacherDta {
  uuid: string;
  uuid_account: string;
  birth: string;
  phone_number: string;
  university_teacher_degree: string;
  email: string;
  department: SimpleModel;
  faculty: SimpleModel;
  id_account: number;
  name: string;
  schedule_data_version: number;
  notification_data_version: number;
  is_female: number;
  permissions: number[];
}
