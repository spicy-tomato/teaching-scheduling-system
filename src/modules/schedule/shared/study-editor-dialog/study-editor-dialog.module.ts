import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyEditorDialogComponent } from './study-editor-dialog.component';
import { PipesModule } from '@pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiBadgeModule,
  TuiCheckboxLabeledModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiDropdownHoverModule,
  TuiFieldErrorModule,
  TuiFilterByInputPipeModule,
  TuiInputDateModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiSelectModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  TuiExpandModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiNotificationModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { StoreModule } from '@ngrx/store';
import * as fromStudyEditorDialog from './state';
import { EffectsModule } from '@ngrx/effects';
import { DirectivesModule } from '@directives/directives.module';
import { ReactiveComponentModule } from '@ngrx/component';
import { StudyEditorRequestChangeCheckerComponent } from './study-editor-request-change/study-editor-request-change-checker/study-editor-request-change-checker.component';
import { StudyHistoryDialogComponent } from './study-history-dialog/study-history-dialog.component';
import { StudyEditorRequestChangeComponent } from './study-editor-request-change/study-editor-request-change.component';
import { StudyEditorRequestChangeIntendComponent } from './study-editor-request-change-intend/study-editor-request-change-intend.component';
import { StudyEditorButtonsLeftComponent } from './study-editor-buttons-left/study-editor-buttons-left.component';
import { StudyEditorButtonsRightComponent } from './study-editor-buttons-right/study-editor-buttons-right.component';
import { StudyEditorHeaderComponent } from './study-editor-header/study-editor-header.component';
import { TuiFilterPipeModule } from '@taiga-ui/cdk';

const NGRX = [
  StoreModule.forFeature(
    fromStudyEditorDialog.studyEditorDialogFeatureKey,
    fromStudyEditorDialog.studyEditorDialogReducer
  ),
  EffectsModule.forFeature([fromStudyEditorDialog.StudyEditorDialogEffects]),
  ReactiveComponentModule,
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
  TuiDropdownControllerModule,
  TuiLoaderModule,
  TuiNotificationModule,
  TuiBadgeModule,
  TuiLinkModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiCheckboxLabeledModule,
  TuiFilterPipeModule,
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
  declarations: [
    StudyEditorDialogComponent,
    StudyEditorRequestChangeCheckerComponent,
    StudyHistoryDialogComponent,
    StudyEditorRequestChangeComponent,
    StudyEditorRequestChangeIntendComponent,
    StudyEditorButtonsLeftComponent,
    StudyEditorButtonsRightComponent,
    StudyEditorHeaderComponent,
  ],
  exports: [StudyEditorDialogComponent, StudyHistoryDialogComponent],
})
export class StudyEditorDialogModule {}
