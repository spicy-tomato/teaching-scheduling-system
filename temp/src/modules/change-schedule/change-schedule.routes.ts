import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionConstant } from '@shared/constants';
import { PermissionGuard } from '@shared/guards/permission.guard';
import { ChangeScheduleComponent } from './change-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeScheduleComponent,
    data: {
      breadcrumb: 'Thay đổi giờ giảng',
    },
    children: [
      {
        path: 'my-requests',
        loadChildren: async () =>
          (await import('./requests/requests.module')).RequestsModule,
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionConstant.REQUEST_CHANGE_TEACHING_SCHEDULE],
          redirect: 'change-schedule/requests',
          personal: true,
        },
      },
      {
        path: 'requests',
        loadChildren: async () =>
          (await import('./requests/requests.module')).RequestsModule,
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            PermissionConstant.ACCEPT_CHANGE_TEACHING_SCHEDULE,
            PermissionConstant.MANAGE_ROOM,
          ],
          personal: false,
        },
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'my-requests',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeScheduleRoutingModule {}
