import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarDateTimePipe } from './calendar-date-time.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [CalendarDateTimePipe],
  exports: [CalendarDateTimePipe],
})
export class CalendarDateTimePipeModule {}
