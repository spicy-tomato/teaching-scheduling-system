import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignExamDialogComponent } from './assign-exam-dialog.component';
import { TuiDataListWrapperModule, TuiMultiSelectModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiMultiSelectModule,
  TuiDataListModule,
  TuiDataListWrapperModule,
  TuiTextfieldControllerModule,
  TuiDropdownControllerModule,
  TuiButtonModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [AssignExamDialogComponent],
  exports: [AssignExamDialogComponent],
})
export class AssignExamDialogModule {}
