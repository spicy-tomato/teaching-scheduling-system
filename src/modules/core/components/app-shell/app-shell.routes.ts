import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppShellComponent } from './app-shell.component';

const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        // loadChildren: async () => (await import('@modules/home/home.module')).HomeModule
        redirectTo: 'schedule',
      },
      {
        path: 'notification',
        loadChildren: async () =>
          (await import('@modules/notification/notification.module'))
            .NotificationModule,
      },
      {
        path: 'schedule',
        loadChildren: async () =>
          (await import('@modules/schedule/schedule-page.module'))
            .SchedulerPageModule,
      },
      {
        path: 'user-setting',
        loadChildren: async () =>
          (await import('@modules/user-setting/user-setting.module'))
            .UserSettingModule,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppShellRoutingModule {}
