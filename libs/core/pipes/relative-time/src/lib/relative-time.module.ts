import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelativeTimePipe } from './relative-time.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [RelativeTimePipe],
  exports: [RelativeTimePipe],
})
export class RelativeTimePipeModule {}
