import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule, TuiHostedDropdownModule } from '@taiga-ui/core';
import { TuiCalendarMonthModule } from '@taiga-ui/kit';
import { TouchScreenDirectiveModule } from '@teaching-scheduling-system/core/directives/touch-screen';
import { ShortenNamePipeModule } from '@teaching-scheduling-system/core/pipes/shorten-name';
import { CalendarFilterModule } from '@teaching-scheduling-system/web/calendar/ui/calendar-filter';
import { NavigateDirectiveModule } from '@teaching-scheduling-system/web/calendar/ui/navigate';
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
    TouchScreenDirectiveModule,
    ShortenNamePipeModule,
    CalendarFilterModule,
    NavigateDirectiveModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [CalendarHeaderComponent],
  exports: [CalendarHeaderComponent],
})
export class CalendarHeaderModule {}
