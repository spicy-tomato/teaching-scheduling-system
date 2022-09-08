import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShellComponent } from './shell.component';
import { TuiActionModule } from '@taiga-ui/kit';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiLoaderModule } from '@taiga-ui/core';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiActionModule, TuiLoaderModule];

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
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [ShellComponent],
})
export class ShellModule {}
