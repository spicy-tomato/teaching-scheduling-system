import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionConstant } from '@constants/core/permission.constant';
import { PermissionGuard } from 'src/shared/guards/permission.guard';
import { AppShellComponent } from './app-shell.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Trang chủ',
    },
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
            .SchedulePageModule,
      },
      {
        path: 'assign-schedule',
        loadChildren: async () =>
          (await import('@modules/assign-schedule/assign-schedule.module'))
            .AssignScheduleModule,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionConstant.ASSIGN_SCHEDULE],
        },
      },
      {
        path: 'user-setting',
        loadChildren: async () =>
          (await import('@modules/user-setting/user-setting.module'))
            .UserSettingModule,
      },
      {
        path: 'feedback',
        loadChildren: async () =>
          (await import('@modules/feedback/feedback.module')).FeedbackModule,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppShellRoutingModule {}
