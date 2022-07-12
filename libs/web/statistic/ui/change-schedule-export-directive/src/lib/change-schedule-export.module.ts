import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeScheduleExportDirective } from './change-schedule-export.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [ChangeScheduleExportDirective],
  exports: [ChangeScheduleExportDirective],
})
export class ChangeScheduleExportDirectiveModule {}
