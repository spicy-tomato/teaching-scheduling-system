import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeScheduleFilterComponent } from './change-schedule-filter.component';
import { TuiInputDateRangeModule } from '@taiga-ui/kit';
import { ReactiveComponentModule } from '@ngrx/component';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiInputDateRangeModule, TuiButtonModule];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ...NGRX, ...TAIGA_UI],
  declarations: [ChangeScheduleFilterComponent],
  exports: [ChangeScheduleFilterComponent],
})
export class ChangeScheduleFilterModule {}
