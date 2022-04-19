import {
  Nullable,
  RequestChangeScheduleCode,
} from '@shared/models';
import { PermissionConstant } from './permission.constant';

export class CoreConstant {
  public static readonly REASON_CHANGE_SCHEDULE_MAX_LENGTH = 500;
  public static readonly INTEND_TIME_CHANGE_SCHEDULE_MAX_LENGTH = 100;
  public static readonly NOTE_MAX_LENGTH = 1000;
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
  public static REQUEST_CHANGE_SCHEDULE_STATUS: Record<
    RequestChangeScheduleCode,
    {
      name: string;
      feature: Nullable<number>;
      mergeWith?: RequestChangeScheduleCode[];
      hide?: boolean;
    }
  > = {
    // Cancel
    100: {
      name: 'Đã hủy',
      feature: PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE,
    },

    // Pending
    200: {
      name: 'Đang chờ bộ môn phê duyệt',
      feature: PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE,
      mergeWith: [201],
    },
    201: {
      // Move to intend time
      name: 'Đang chờ bộ môn phê duyệt',
      feature: PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE,
      hide: true,
    },
    202: {
      name: 'Đang chờ Ban QLGĐ xếp phòng',
      feature: null,
    },

    // Approve
    300: {
      name: 'Đã chấp nhận',
      feature: null,
      mergeWith: [301, 302],
    },
    301: {
      // Move to intend time
      name: 'Đã chấp nhận',
      feature: PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE,
      hide: true,
    },
    302: {
      // Accept online class
      name: 'Đã chấp nhận',
      feature: PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE,
      hide: true,
    },

    // Change
    400: {
      name: 'Trưởng bộ môn thay đổi',
      feature: PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE,
    },

    // Deny
    500: {
      name: 'Trưởng bộ môn từ chối',
      feature: PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE,
    },
    501: { name: 'Phòng QLGĐ từ chối', feature: null },
  };
}
