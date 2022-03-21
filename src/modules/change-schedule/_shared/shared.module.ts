import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '@directives/directives.module';

const EXPORT = [CommonModule, DirectivesModule];

@NgModule({
  imports: [...EXPORT],
  exports: [...EXPORT],
})
export class SharedChangeScheduleModule {}
