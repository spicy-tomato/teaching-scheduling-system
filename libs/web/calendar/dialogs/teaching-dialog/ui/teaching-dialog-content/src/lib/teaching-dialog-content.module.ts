import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiFilterPipeModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiErrorModule,
  TuiExpandModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiNotificationModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiCheckboxLabeledModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputDateModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiSelectModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { VarDirectiveModule } from '@teaching-scheduling-system/core/directives/var';
import { FilterByInputPipeModule } from '@teaching-scheduling-system/core/pipes/filter-by-input-pipe';
import { TeachingHistoryDirectiveModule } from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/ui/teaching-history';
import { DuplicateCheckerComponent } from './duplicate-checker/duplicate-checker.component';
import { ShiftPipe } from './shift-pipe/shift-pipe.pipe';
import { TeachingDialogButtonsLeftComponent } from './teaching-dialog-buttons-left/teaching-dialog-buttons-left.component';
import { TeachingDialogButtonsRightComponent } from './teaching-dialog-buttons-right/teaching-dialog-buttons-right.component';
import { TeachingDialogContentComponent } from './teaching-dialog-content.component';
import { TeachingDialogRequestChangeIntendComponent } from './teaching-dialog-request-change-intend/teaching-dialog-request-change-intend.component';
import { TeachingDialogRequestChangeComponent } from './teaching-dialog-request-change/teaching-dialog-request-change.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiButtonModule,
  TuiCheckboxLabeledModule,
  TuiComboBoxModule,
  TuiDataListModule,
  TuiDataListWrapperModule,
  TuiErrorModule,
  TuiExpandModule,
  TuiFieldErrorPipeModule,
  TuiFilterPipeModule,
  TuiHostedDropdownModule,
  TuiInputDateModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiNotificationModule,
  TuiSelectModule,
  TuiSvgModule,
  TuiTextAreaModule,
  TuiTextfieldControllerModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FilterByInputPipeModule,
    VarDirectiveModule,
    TeachingHistoryDirectiveModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [
    TeachingDialogContentComponent,
    TeachingDialogButtonsLeftComponent,
    TeachingDialogButtonsRightComponent,
    TeachingDialogRequestChangeComponent,
    TeachingDialogRequestChangeIntendComponent,
    DuplicateCheckerComponent,
    ShiftPipe,
  ],
  exports: [TeachingDialogContentComponent],
})
export class TeachingDialogContentModule {}
