import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticChangeScheduleComponent } from './statistic-change-schedule.component';
import { StatisticChangeScheduleRoutingModule } from './statistic-change-schedule.routes';
import { TuiInputDateRangeModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';

const TAIGA_UI = [TuiInputDateRangeModule, TuiButtonModule];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StatisticChangeScheduleRoutingModule,
    ...TAIGA_UI,
  ],
  declarations: [StatisticChangeScheduleComponent],
})
export class StatisticChangeScheduleModule {}
