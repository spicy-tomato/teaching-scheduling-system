import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'assign',
        data: {
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
        data: {
          breadcrumb: 'Nhập dữ liệu',
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
