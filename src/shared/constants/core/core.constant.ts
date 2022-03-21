import { FeatureModel, Nullable } from '@shared/models';
import { PermissionConstant } from './permission.constant';

export class CoreConstant {
  public static readonly TERMS_IN_YEAR = [1, 2];
  public static readonly BATCHES_IN_TERM: { [key: number]: number[] } = {
    1: [1, 2, 3],
    2: [1, 2, 3, 5],
  };
  public static readonly CLASS_TYPE: { [key: number]: string } = {
    1: 'Lý thuyết',
    2: 'Bài tập',
    3: 'Thực hành',
  };
  public static readonly SHIFTS: {
    [key: string]: { start: number[]; end: number[] };
  } = {
    '1': {
      start: [7, 0],
      end: [9, 25],
    },
    '2': {
      start: [9, 35],
      end: [12, 0],
    },
    '3': {
      start: [13, 0],
      end: [15, 25],
    },
    '4': {
      start: [15, 35],
      end: [18, 0],
    },
    '5_1': {
      start: [18, 5],
      end: [20, 30],
    },
    '5_2': {
      start: [18, 5],
      end: [21, 20],
    },
  };
  public static REQUEST_CHANGE_SCHEDULE_STATUS: {
    [key: number]: FeatureModel<string, Nullable<number>>;
  } = {
    '-3': {
      name: 'Đã hủy',
      feature: PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE,
    },
    '-2': { name: 'Phòng QLGĐ từ chối', feature: null },
    '-1': {
      name: 'Đã từ chối',
      feature: PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE,
    },
    0: {
      name: 'Đang chờ bộ môn phê duyệt',
      feature: PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE,
    },
    1: { name: 'Đang chờ Ban QLGĐ xếp phòng', feature: null },
    2: { name: 'Đã chấp nhận', feature: null },
    3: {
      name: 'Đã chấp nhận',
      feature: PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE,
    },
    4: {
      name: 'Trưởng bộ môn thay đổi',
      feature: PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE,
    },
  };
}
