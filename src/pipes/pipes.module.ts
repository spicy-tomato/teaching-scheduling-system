import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTimePipe } from './date-time.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [DateTimePipe],
  exports: [DateTimePipe],
})
export class PipesModule {}
