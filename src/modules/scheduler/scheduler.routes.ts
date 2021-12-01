import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulerComponent } from './scheduler.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Lịch giảng dạy'
    },
    component: SchedulerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
