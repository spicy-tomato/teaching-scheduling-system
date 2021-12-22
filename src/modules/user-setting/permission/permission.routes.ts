import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionComponent } from './permission.component';

const routes: Routes = [
  {
    path: '',
    component: PermissionComponent,
    data: {
      breadcrumb: 'Quản lý ủy quyền',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermissionRoutingModule {}
