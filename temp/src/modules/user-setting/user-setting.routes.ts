import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSettingComponent } from './user-setting.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Cài đặt',
    },
    children: [
      {
        path: 'change-password',
        loadChildren: async () =>
          (await import('./change-password/change-password.module'))
            .ChangePasswordModule,
      },
      {
        path: 'permission',
        loadChildren: async () =>
          (await import('./permission/permission.module')).PermissionModule,
      },
      {
        path: '',
        pathMatch: 'full',
        component: UserSettingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSettingRoutingModule {}
