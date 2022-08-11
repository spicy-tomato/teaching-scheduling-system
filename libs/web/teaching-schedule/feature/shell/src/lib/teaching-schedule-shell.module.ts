import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermissionConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { PermissionGuard } from '@teaching-scheduling-system/web/shared/utils/guards';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'assign',
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionConstant.ASSIGN_SCHEDULE],
          title: 'Danh sách phân giảng',
          breadcrumb: 'Phân giảng',
        },
        loadChildren: async () =>
          (
            await import(
              '@teaching-scheduling-system/web/teaching-schedule/feature/assign'
            )
          ).AssignModule,
      },
      {
        path: 'change',
        data: {
          breadcrumb: 'Thay đổi',
        },
        loadChildren: async () =>
          (
            await import(
              '@teaching-scheduling-system/web/teaching-schedule/feature/change'
            )
          ).ChangeModule,
      },
      {
        path: 'import',
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionConstant.ASSIGN_SCHEDULE],
          title: 'Nhập dữ liệu phân giảng',
          breadcrumb: 'Nhập dữ liệu',
          group: 'Phân giảng',
        },
        loadChildren: async () =>
          (
            await import(
              '@teaching-scheduling-system/web/teaching-schedule/feature/import'
            )
          ).ImportModule,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'change',
      },
    ]),
  ],
})
export class TeachingScheduleShellModule {}
