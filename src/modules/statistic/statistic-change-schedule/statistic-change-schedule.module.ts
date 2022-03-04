import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticChangeScheduleComponent } from './statistic-change-schedule.component';
import { StatisticChangeScheduleRoutingModule } from './statistic-change-schedule.routes';
import { TuiInputDateRangeModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as fromStatisticChangeSchedule from './state';
import { StatisticChangeScheduleFilterComponent } from './statistic-change-schedule-filter/statistic-change-schedule-filter.component';
import { TuiAxesModule, TuiBarChartModule } from '@taiga-ui/addon-charts';
import { StatisticChangeScheduleChartComponent } from './statistic-change-schedule-chart/statistic-change-schedule-chart.component';
import { PipesModule } from '@pipes/pipes.module';
import { ReactiveComponentModule } from '@ngrx/component';

const NGRX = [
  ReactiveComponentModule,
  StoreModule.forFeature(
    fromStatisticChangeSchedule.statisticChangeScheduleFeatureKey,
    fromStatisticChangeSchedule.statisticChangeScheduleReducer
  ),
  EffectsModule.forFeature([
    fromStatisticChangeSchedule.StatisticChangeScheduleEffects,
  ]),
];
const TAIGA_UI = [
  TuiInputDateRangeModule,
  TuiButtonModule,
  TuiAxesModule,
  TuiBarChartModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StatisticChangeScheduleRoutingModule,
    PipesModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [
    StatisticChangeScheduleComponent,
    StatisticChangeScheduleFilterComponent,
    StatisticChangeScheduleChartComponent,
  ],
})
export class StatisticChangeScheduleModule {}
