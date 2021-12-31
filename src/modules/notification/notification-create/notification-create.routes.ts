import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormDiscardGuard } from '@shared/guards';
import { NotificationCreateManagingClassComponent } from './components/notification-create-managing-class/notification-create-managing-class.component';
import { NotificationCreateModuleClassComponent } from './components/notification-create-module-class/notification-create-module-class.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Tạo thông báo',
    },
    children: [
      {
        path: 'managing-class',
        component: NotificationCreateManagingClassComponent,
        data: {
          breadcrumb: 'Lớp quản lý',
        },
        canDeactivate: [FormDiscardGuard],
      },
      {
        path: 'module-class',
        component: NotificationCreateModuleClassComponent,
        data: {
          breadcrumb: 'Lớp học phần',
        },
        canDeactivate: [FormDiscardGuard],
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'managing-class',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationCreateRoutingModule {}
