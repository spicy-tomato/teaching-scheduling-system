import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        data: {
          title: 'Thống kê thay đổi giờ giảng',
          breadcrumb: 'Thay đổi giờ giảng',
        },
        loadChildren: async () =>
          (
            await import(
              '@teaching-scheduling-system/web/statistic/feature/change-schedule'
            )
          ).ChangeScheduleModule,
      },
    ]),
  ],
})
export class ShellModule {}
