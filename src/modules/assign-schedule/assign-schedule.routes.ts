import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignScheduleComponent } from './assign-schedule.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Phân giảng',
    },
    component: AssignScheduleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignScheduleRoutingModule {}
