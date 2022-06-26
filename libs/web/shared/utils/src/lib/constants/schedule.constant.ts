import { PermissionConstant } from '@teaching-scheduling-system/core/data-access/constants';
import {
  RequestChangeScheduleCode,
  Nullable,
} from '@teaching-scheduling-system/core/data-access/models';

export class ScheduleConstant {
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
