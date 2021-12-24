import { CommonInfoModel } from '@models/core/common-info.model';
import { TeacherDta } from './teacher.dta';

export interface AuthResponseDta {
  data: TeacherDta;
  localData: CommonInfoModel;
}
