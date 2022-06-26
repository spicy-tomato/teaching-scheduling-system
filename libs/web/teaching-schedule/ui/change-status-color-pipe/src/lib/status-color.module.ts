import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusColorPipe } from './status-color.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [StatusColorPipe],
  exports: [StatusColorPipe],
})
export class StatusColorPipeModule {}
