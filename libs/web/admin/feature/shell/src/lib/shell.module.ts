import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'web-config',
        data: {
          breadcrumb: 'Cấu hình web',
        },
        loadChildren: async () =>
          (
            await import(
              '@teaching-scheduling-system/web/admin/feature/web-config'
            )
          ).WebConfigModule,
      },
    ]),
  ],
})
export class ShellModule {}
