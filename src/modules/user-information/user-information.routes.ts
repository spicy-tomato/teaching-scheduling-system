import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserInformationComponent } from './user-information.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Thông tin cá nhân',
    },
    component: UserInformationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserInformationRoutingModule {}
