import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule, TuiHostedDropdownModule } from '@taiga-ui/core';
import { TuiCalendarMonthModule } from '@taiga-ui/kit';
import { TouchScreenOrDirectiveModule } from '@teaching-scheduling-system/core/directives/touch-screen-or';
import { ShortenNamePipeModule } from '@teaching-scheduling-system/core/pipes/shorten-name';
import { CalendarFilterModule } from '@teaching-scheduling-system/web/calendar/ui/calendar-filter';
import { CalendarHeaderComponent } from './calendar-header.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiButtonModule,
  TuiCalendarMonthModule,
  TuiHostedDropdownModule,
];

@NgModule({
  imports: [
    CommonModule,
    TouchScreenOrDirectiveModule,
    ShortenNamePipeModule,
    CalendarFilterModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [CalendarHeaderComponent],
  exports: [CalendarHeaderComponent],
})
export class CalendarHeaderModule {}
