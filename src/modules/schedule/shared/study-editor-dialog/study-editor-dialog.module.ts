import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyEditorDialogComponent } from './study-editor-dialog.component';
import { PipesModule } from '@pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiDropdownHoverModule,
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
  TuiHostedDropdownModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { StoreModule } from '@ngrx/store';
import * as fromStudyEditorDialog from './state';
import { EffectsModule } from '@ngrx/effects';
import { DirectivesModule } from '@directives/directives.module';

const NGRX = [
  StoreModule.forFeature(
    fromStudyEditorDialog.studyEditorDialogFeatureKey,
    fromStudyEditorDialog.studyEditorDialogReducer
  ),
  EffectsModule.forFeature([fromStudyEditorDialog.StudyEditorDialogEffects]),
];

const TAIGA_UI = [
  TuiInputModule,
  TuiInputDateTimeModule,
  TuiExpandModule,
  TuiFieldErrorModule,
  TuiTextAreaModule,
  TuiTextfieldControllerModule,
  TuiHostedDropdownModule,
  TuiSvgModule,
  TuiInputDateModule,
  TuiSelectModule,
  TuiDataListModule,
  TuiButtonModule,
  TuiDropdownHoverModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    DirectivesModule,
    ...TAIGA_UI,
    ...NGRX,
  ],
  declarations: [StudyEditorDialogComponent],
  exports: [StudyEditorDialogComponent],
})
export class StudyEditorDialogModule {}
