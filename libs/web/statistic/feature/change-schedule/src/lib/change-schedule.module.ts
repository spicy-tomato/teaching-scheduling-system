import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatisticChangeScheduleStore } from '@teaching-scheduling-system/web/statistic/data-access';
import { ChangeScheduleChartModule } from '@teaching-scheduling-system/web/statistic/ui/change-schedule-chart';
import { ChangeScheduleFilterModule } from '@teaching-scheduling-system/web/statistic/ui/change-schedule-filter';
import { ChangeScheduleComponent } from './change-schedule.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ChangeScheduleComponent }]),
    ChangeScheduleChartModule,
    ChangeScheduleFilterModule,
  ],
  declarations: [ChangeScheduleComponent],
  providers: [StatisticChangeScheduleStore],
})
export class ChangeScheduleModule {}
