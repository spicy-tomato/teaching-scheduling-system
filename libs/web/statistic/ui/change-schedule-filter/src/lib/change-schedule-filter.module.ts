import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule } from '@taiga-ui/core';
import { InputDateRangeModule } from '@teaching-scheduling-system/web/shared/ui/components/input-date-range';
import { ChangeScheduleExportDirectiveModule } from '@teaching-scheduling-system/web/statistic/ui/change-schedule-export-directive';
import { ChangeScheduleFilterComponent } from './change-schedule-filter.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiButtonModule];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChangeScheduleExportDirectiveModule,
    InputDateRangeModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [ChangeScheduleFilterComponent],
  exports: [ChangeScheduleFilterComponent],
})
export class ChangeScheduleFilterModule {}
