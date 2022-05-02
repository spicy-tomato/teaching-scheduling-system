import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTimePipe } from './date-time.pipe';
import { NavbarNamePipe } from './navbar-name.pipe';
import { BeautifyTimePipe } from './beautify-date-time.pipe';
import { ShiftPipe } from './shift.pipe';
import { TuiDayPipe } from './tui-day.pipe';
import { FilterPipe } from './filter.pipe';
import { ShortenNamePipe } from './shorten-name.pipe';
import { MapPipe } from './map.pipe';
import { AsPipe } from './as.pipe';
import { StatusTypePipe } from './status-type.pipe';
import { ChangeStatusTypePipe } from './change-status-type.pipe';
import { ChangeCanExportPipe } from './change-can-export.pipe';
import { ArrayIncludesPipe } from './array-includes.pipe';

const PIPES = [
  AsPipe,
  BeautifyTimePipe,
  ChangeCanExportPipe,
  ChangeStatusTypePipe,
  DateTimePipe,
  FilterPipe,
  MapPipe,
  NavbarNamePipe,
  ShiftPipe,
  ShortenNamePipe,
  StatusTypePipe,
  TuiDayPipe,
  ArrayIncludesPipe,
];

@NgModule({
  imports: [CommonModule],
  declarations: [...PIPES],
  exports: [...PIPES],
})
export class PipesModule {}
