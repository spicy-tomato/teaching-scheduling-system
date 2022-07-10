import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigateDirective } from './navigate.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [NavigateDirective],
  exports: [NavigateDirective],
})
export class NavigateDirectiveModule {}
