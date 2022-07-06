import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'request',
        loadChildren: async () =>
          (
            await import(
              '@teaching-scheduling-system/web/reset-password/feature/send-email'
            )
          ).SendEmailModule,
      },
      {
        path: '',
        pathMatch: 'full',
        loadChildren: async () =>
          (
            await import(
              '@teaching-scheduling-system/web/reset-password/feature/confirm'
            )
          ).ConfirmModule,
      },
    ]),
  ],
})
export class ShellModule {}
