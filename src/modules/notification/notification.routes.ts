import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Thông báo',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: async () =>
          (await import('./notification-list/notification-list.module'))
            .NotificationListModule,
      },
      {
        path: 'create',
        loadChildren: async () =>
          (await import('./notification-create/notification-create.module'))
            .NotificationCreateModule,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationRoutingModule {}
