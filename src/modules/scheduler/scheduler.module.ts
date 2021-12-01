import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerComponent } from './scheduler.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleRoutingModule } from './scheduler.routes';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';

@NgModule({
  imports: [CommonModule, ScheduleRoutingModule, ScheduleModule],
  declarations: [SchedulerComponent, ScheduleComponent],
})
export class SchedulerModule {}
