import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TouchScreenDirective } from './touch-screen.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [TouchScreenDirective],
  exports: [TouchScreenDirective],
})
export class TouchScreenDirectiveModule {}
