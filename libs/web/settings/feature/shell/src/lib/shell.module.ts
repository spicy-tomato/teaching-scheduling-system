import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiActionModule } from '@taiga-ui/kit';
import { ShellComponent } from './shell.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiActionModule, TuiButtonModule, TuiLoaderModule];

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
