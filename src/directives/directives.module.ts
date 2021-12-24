import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionDirective } from './permission.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [PermissionDirective],
  exports: [PermissionDirective],
})
export class DirectivesModule {}
