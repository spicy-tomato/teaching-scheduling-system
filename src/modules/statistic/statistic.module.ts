import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticComponent } from './statistic.component';
import { StatisticRoutingModule } from './statistic.routes';

@NgModule({
  imports: [CommonModule, StatisticRoutingModule],
  declarations: [StatisticComponent],
})
export class StatisticModule {}
