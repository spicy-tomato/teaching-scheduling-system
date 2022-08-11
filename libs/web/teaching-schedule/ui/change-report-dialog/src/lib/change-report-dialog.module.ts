import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule } from '@taiga-ui/core';
import { InputDateRangeModule } from '@teaching-scheduling-system/web/shared/ui/components/input-date-range';
import { ChangeReportDialogComponent } from './change-report-dialog.component';
import { ExportDialogStore } from './store';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiButtonModule];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputDateRangeModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [ChangeReportDialogComponent],
  exports: [ChangeReportDialogComponent],
  providers: [ExportDialogStore],
})
export class ChangeReportDialogModule {}
