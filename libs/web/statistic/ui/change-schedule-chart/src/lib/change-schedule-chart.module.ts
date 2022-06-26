import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiAxesModule, TuiBarChartModule } from '@taiga-ui/addon-charts';
import { TuiLoaderModule } from '@taiga-ui/core';
import { ChangeScheduleChartComponent } from './change-schedule-chart.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiLoaderModule, TuiAxesModule, TuiBarChartModule];

@NgModule({
  imports: [CommonModule, ...NGRX, ...TAIGA_UI],
  declarations: [ChangeScheduleChartComponent],
  exports: [ChangeScheduleChartComponent],
})
export class ChangeScheduleChartModule {}
