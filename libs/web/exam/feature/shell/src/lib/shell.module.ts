import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'assign',
        data: {
          breadcrumb: 'Phân lịch thi',
        },
        loadChildren: async () =>
          (await import('@teaching-scheduling-system/web/exam/feature/assign'))
            .AssignModule,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'assign',
      },
    ]),
  ],
})
export class ShellModule {}
