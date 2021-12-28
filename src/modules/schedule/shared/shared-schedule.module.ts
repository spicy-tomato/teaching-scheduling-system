import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterSelfPipe } from './filter-self.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [FilterSelfPipe],
  exports: [FilterSelfPipe],
})
export class SharedScheduleModule {}
