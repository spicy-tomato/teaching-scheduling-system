import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrayPipe } from './array.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [ArrayPipe],
  exports: [ArrayPipe],
})
export class ArrayPipeModule {}
