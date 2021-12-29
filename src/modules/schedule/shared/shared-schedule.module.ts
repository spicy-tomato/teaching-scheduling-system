import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterSelfPipe } from './filter-self.pipe';
import { ExamEditorDialogComponent } from './exam-editor-dialog/exam-editor-dialog.component';
import { StudyEditorDialogComponent } from './study-editor-dialog/study-editor-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiFieldErrorModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiHintControllerModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';

const EXPORT_TAIGA_UI = [TuiButtonModule, TuiTextfieldControllerModule];
const TAIGA_UI = [
  TuiInputModule,
  TuiInputDateTimeModule,
  TuiTextAreaModule,
  TuiHintControllerModule,
  TuiFieldErrorModule,
  ...EXPORT_TAIGA_UI,
];
const EXPORT = [CommonModule, FormsModule, ReactiveFormsModule];

@NgModule({
  imports: [...EXPORT, ...TAIGA_UI],
  declarations: [
    FilterSelfPipe,
    ExamEditorDialogComponent,
    StudyEditorDialogComponent,
  ],
  exports: [
    FilterSelfPipe,
    ExamEditorDialogComponent,
    StudyEditorDialogComponent,
    ...EXPORT,
    ...EXPORT_TAIGA_UI,
  ],
})
export class SharedScheduleModule {}
