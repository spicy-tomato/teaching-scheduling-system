import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamEditorDialogComponent } from './exam-editor-dialog/exam-editor-dialog.component';
import { StudyEditorDialogComponent } from './study-editor-dialog/study-editor-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiExpandModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { PipesModule } from '@pipes/pipes.module';
import { ReactiveComponentModule } from '@ngrx/component';
import { DirectivesModule } from '@directives/directives.module';
import { StudyEditorDialogModule } from './study-editor-dialog/study-editor-dialog.module';
import { ExamEditorDialogModule } from './exam-editor-dialog/exam-editor-dialog.module';

const EXPORT = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  PipesModule,
  DirectivesModule,
];

const NGRX = [ReactiveComponentModule];

const TAIGA_UI = [
  TuiButtonModule,
  TuiTextfieldControllerModule,
  TuiExpandModule,
  TuiSelectModule,
  TuiDataListModule,
  TuiDataListWrapperModule,
];

@NgModule({
  imports: [ExamEditorDialogModule, StudyEditorDialogModule],
  exports: [
    StudyEditorDialogComponent,
    ExamEditorDialogComponent,
    ...EXPORT,
    ...NGRX,
    ...TAIGA_UI,
  ],
})
export class SharedScheduleModule {}
