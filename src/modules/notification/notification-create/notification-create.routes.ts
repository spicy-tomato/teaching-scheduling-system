import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationCreateComponent } from './notification-create.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Tạo thông báo'
    },
    component: NotificationCreateComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationCreateRoutingModule { }
