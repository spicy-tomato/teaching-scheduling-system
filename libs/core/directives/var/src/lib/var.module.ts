import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VarDirective } from './var.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [VarDirective],
  exports: [VarDirective],
})
export class VarDirectiveModule {}
