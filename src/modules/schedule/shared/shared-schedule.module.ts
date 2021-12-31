import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterSelfPipe } from './filter-self.pipe';
import { ExamEditorDialogComponent } from './exam-editor-dialog/exam-editor-dialog.component';
import { StudyEditorDialogComponent } from './study-editor-dialog/study-editor-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFieldErrorModule,
  TuiFilterByInputPipeModule,
  TuiInputDateModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiSelectModule,
  TuiTextAreaModule,
  TuiUnfinishedValidatorModule,
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
import { ReactiveComponentModule } from '@ngrx/component';

const EXPORT = [CommonModule, FormsModule, ReactiveFormsModule, PipesModule];
const COMPONENTS = [ExamEditorDialogComponent, StudyEditorDialogComponent];

const EXPORT_NGRX = [ReactiveComponentModule];
const NGRX = [...EXPORT_NGRX];

const EXPORT_TAIGA_UI = [
  TuiButtonModule,
  TuiTextfieldControllerModule,
  TuiExpandModule,
  TuiSelectModule,
  TuiDataListModule,
  TuiDataListWrapperModule,
];
const TAIGA_UI = [
  TuiInputModule,
  TuiInputDateTimeModule,
  TuiTextAreaModule,
  TuiHintControllerModule,
  TuiFieldErrorModule,
  TuiInputDateModule,
  TuiComboBoxModule,
  TuiFilterByInputPipeModule,
  TuiUnfinishedValidatorModule,
  ...EXPORT_TAIGA_UI,
];

@NgModule({
  imports: [...EXPORT, ...TAIGA_UI, ...NGRX],
  declarations: [FilterSelfPipe, ...COMPONENTS, ShiftPipe],
  exports: [
    FilterSelfPipe,
    ...COMPONENTS,
    ...EXPORT,
    ...EXPORT_NGRX,
    ...EXPORT_TAIGA_UI,
  ],
})
export class SharedScheduleModule {}
