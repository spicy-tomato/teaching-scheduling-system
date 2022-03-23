import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignScheduleResultComponent } from './assign-schedule-result.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Phân giảng',
    },
    component: AssignScheduleResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignScheduleResultRoutingModule {}
