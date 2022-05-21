import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamEditorDialogComponent } from './exam-editor-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TuiFieldErrorModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { TuiButtonModule, TuiTextfieldControllerModule } from '@taiga-ui/core';

const TAIGA_UI = [
  TuiInputModule,
  TuiInputDateTimeModule,
  TuiTextfieldControllerModule,
  TuiButtonModule,
  TuiFieldErrorModule,
  TuiTextAreaModule,
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ...TAIGA_UI],
  declarations: [ExamEditorDialogComponent],
  exports: [ExamEditorDialogComponent],
})
export class ExamEditorDialogModule {}
