import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeachingHistoryDirective } from './teaching-history.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [TeachingHistoryDirective],
  exports: [TeachingHistoryDirective],
})
export class TeachingHistoryDirectiveModule {}
