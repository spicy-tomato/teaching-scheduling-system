import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticChangeScheduleComponent } from './statistic-change-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticChangeScheduleComponent,
    data: {
      breadcrumb: 'Thay đổi lịch giảng',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticChangeScheduleRoutingModule {}
