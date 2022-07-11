import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiInputDateRangeModule } from '@taiga-ui/kit';
import { ChangeScheduleExportDirectiveModule } from '@teaching-scheduling-system/web/statistic/ui/change-schedule-export-directive';
import { ChangeScheduleFilterComponent } from './change-schedule-filter.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiInputDateRangeModule, TuiButtonModule];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChangeScheduleExportDirectiveModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [ChangeScheduleFilterComponent],
  exports: [ChangeScheduleFilterComponent],
})
export class ChangeScheduleFilterModule {}
