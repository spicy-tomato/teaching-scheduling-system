import { CommonInfoModel } from '../models';
import { TeacherDta } from './teacher.dta';

export interface AuthResponseDta {
  data: TeacherDta;
  localData: CommonInfoModel;
}
