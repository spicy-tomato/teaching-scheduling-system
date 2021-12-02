import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulePageComponent } from './schedule.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Lịch giảng dạy'
    },
    component: SchedulePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
