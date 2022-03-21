import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamEditorDialogComponent } from './exam-editor-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiFieldErrorModule,
  TuiInputDateTimeModule,
  TuiInputModule,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiHintControllerModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';

const TAIGA_UI = [
  TuiInputModule,
  TuiInputDateTimeModule,
  TuiHintControllerModule,
  TuiTextfieldControllerModule,
  TuiButtonModule,
  TuiFieldErrorModule,
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...TAIGA_UI],
  declarations: [ExamEditorDialogComponent],
  exports: [ExamEditorDialogComponent],
})
export class ExamEditorDialogModule {}
