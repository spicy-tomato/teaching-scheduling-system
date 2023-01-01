import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InPipe } from './in.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [InPipe],
  exports: [InPipe],
})
export class InPipeModule {}
