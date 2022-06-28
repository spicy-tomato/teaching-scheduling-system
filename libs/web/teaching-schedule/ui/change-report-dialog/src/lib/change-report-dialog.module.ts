import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiInputDateRangeModule } from '@taiga-ui/kit';
import { ChangeReportDialogComponent } from './change-report-dialog.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiInputDateRangeModule, TuiButtonModule];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [ChangeReportDialogComponent],
  exports: [ChangeReportDialogComponent],
})
export class ChangeReportDialogModule {}
