import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTimePipe } from './date-time.pipe';
import { NavbarNamePipe } from './navbar-name.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [DateTimePipe, NavbarNamePipe],
  exports: [DateTimePipe, NavbarNamePipe],
})
export class PipesModule {}
