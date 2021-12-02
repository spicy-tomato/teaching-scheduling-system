import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulePageComponent } from './schedule.component';
import { TssScheduleComponent } from './schedule/schedule.component';
import { ScheduleRoutingModule } from './schedule.routes';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';

@NgModule({
  imports: [CommonModule, ScheduleRoutingModule, ScheduleModule],
  declarations: [SchedulePageComponent, TssScheduleComponent],
})
export class SchedulerPageModule {}
