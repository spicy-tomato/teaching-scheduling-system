import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionDirective } from './permission.directive';
import { VarDirective } from './var.directive';
import { RecreateViewKeyDirective } from './recreate-view-key.directive';

const DIRECTIVES = [
  PermissionDirective,
  VarDirective,
  RecreateViewKeyDirective,
];

@NgModule({
  imports: [CommonModule],
  declarations: [...DIRECTIVES],
  exports: [...DIRECTIVES],
})
export class DirectivesModule {}
