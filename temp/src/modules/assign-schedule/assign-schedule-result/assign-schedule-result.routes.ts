import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignScheduleResultComponent } from './assign-schedule-result.component';

const routes: Routes = [
  {
    path: '',
    component: AssignScheduleResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignScheduleResultRoutingModule {}
