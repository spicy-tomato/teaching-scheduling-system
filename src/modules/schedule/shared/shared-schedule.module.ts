import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterSelfPipe } from './filter-self.pipe';
import { ExamEditorDialogComponent } from './exam-editor-dialog/exam-editor-dialog.component';
import { StudyEditorDialogComponent } from './study-editor-dialog/study-editor-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiFieldErrorModule,
  TuiInputDateModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiSelectModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiExpandModule,
  TuiHintControllerModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { PipesModule } from '@pipes/pipes.module';
import { ShiftPipe } from './study-editor-dialog/shift.pipe';

const EXPORT_TAIGA_UI = [
  TuiButtonModule,
  TuiTextfieldControllerModule,
  TuiExpandModule,
  TuiSelectModule,
  TuiDataListModule,
];
const TAIGA_UI = [
  TuiInputModule,
  TuiInputDateTimeModule,
  TuiTextAreaModule,
  TuiHintControllerModule,
  TuiFieldErrorModule,
  TuiInputDateModule,
  ...EXPORT_TAIGA_UI,
];
const EXPORT = [CommonModule, FormsModule, ReactiveFormsModule, PipesModule];
const COMPONENTS = [ExamEditorDialogComponent, StudyEditorDialogComponent];

@NgModule({
  imports: [...EXPORT, ...TAIGA_UI],
  declarations: [FilterSelfPipe, ...COMPONENTS, ShiftPipe],
  exports: [FilterSelfPipe, ...COMPONENTS, ...EXPORT, ...EXPORT_TAIGA_UI],
})
export class SharedScheduleModule {}
