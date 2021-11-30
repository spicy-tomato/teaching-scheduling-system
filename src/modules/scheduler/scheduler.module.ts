import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './scheduler.component';
import { ScheduleRoutingModule } from './scheduler.routes';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';

@NgModule({
  imports: [CommonModule, ScheduleRoutingModule, ScheduleModule],
  declarations: [ScheduleComponent],
  providers: [],
})
export class SchedulerModule {}
