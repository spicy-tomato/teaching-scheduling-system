import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule, TuiErrorModule } from '@taiga-ui/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { ExamDialogStore } from '@teaching-scheduling-system/web/calendar/dialogs-exam-dialog/data-access';
import { ExamDialogComponent } from './exam-dialog.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiButtonModule,
  TuiErrorModule,
  TuiFieldErrorPipeModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiTextAreaModule,
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ...NGRX, ...TAIGA_UI],
  declarations: [ExamDialogComponent],
  exports: [ExamDialogComponent],
  providers: [ExamDialogStore],
})
export class ExamDialogModule {}
