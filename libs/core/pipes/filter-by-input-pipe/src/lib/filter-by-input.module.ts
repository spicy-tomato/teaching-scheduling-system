import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterByInputPipe } from './filter-by-input.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [FilterByInputPipe],
  exports: [FilterByInputPipe],
})
export class FilterByInputPipeModule {}
