import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionConstant } from '@shared/constants';
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
          (await import('./my-requests/my-requests.module')).MyRequestsModule,
      },
      {
        path: 'requests',
        loadChildren: async () =>
          (await import('./requests/requests.module')).RequestsModule,
        data: {
          permissions: [PermissionConstant.ACCEPT_CHANGE_TEACHING_SCHEDULE],
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
