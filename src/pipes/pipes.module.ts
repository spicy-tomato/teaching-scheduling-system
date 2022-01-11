import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTimePipe } from './date-time.pipe';
import { NavbarNamePipe } from './navbar-name.pipe';
import { BeautifyTimePipe } from './beautify-date-time.pipe';
import { ShiftPipe } from './shift.pipe';
import { TuiDayPipe } from './tui-day.pipe';

const PIPES = [
  DateTimePipe,
  NavbarNamePipe,
  BeautifyTimePipe,
  ShiftPipe,
  TuiDayPipe,
];

@NgModule({
  imports: [CommonModule],
  declarations: [...PIPES],
  exports: [...PIPES],
})
export class PipesModule {}
