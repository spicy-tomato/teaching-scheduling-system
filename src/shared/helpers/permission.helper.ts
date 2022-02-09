import { PermissionConstant } from '@shared/constants';

export class PermissionHelper {
  public static isTeacher(permissions: number[]): boolean {
    return permissions.includes(
      PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE
    );
  }

  public static isDepartmentHead(permissions: number[]): boolean {
    return permissions.includes(PermissionConstant.SEE_DEPARTMENT_SCHEDULE);
  }

  public static getRole(
    permissions: number[]
  ): 'teacher' | 'departmentHead' | 'roomManager' {
    if (permissions.includes(PermissionConstant.MANAGE_ROOM)) {
      return 'roomManager';
    }
    if (permissions.includes(PermissionConstant.SEE_DEPARTMENT_SCHEDULE)) {
      return 'departmentHead';
    }
    return 'teacher';
  }
}
