import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShellComponent } from './shell.component';
import { TuiActionModule } from '@taiga-ui/kit';

const TAIGA_UI = [TuiActionModule];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ShellComponent },
      {
        path: 'change-password',
        data: {
          breadcrumb: 'Đổi mật khẩu',
        },
        loadChildren: async () =>
          (
            await import(
              '@teaching-scheduling-system/web/settings/feature/change-password'
            )
          ).ChangePasswordModule,
      },
    ]),
    ...TAIGA_UI,
  ],
  declarations: [ShellComponent],
})
export class ShellModule {}
