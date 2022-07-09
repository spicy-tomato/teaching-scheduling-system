import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TouchScreenOrDirective } from './touch-screen-or.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [TouchScreenOrDirective],
  exports: [TouchScreenOrDirective],
})
export class TouchScreenOrDirectiveModule {}
