import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import {
  TuiButtonModule,
  TuiDropdownModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiMultiSelectModule } from '@taiga-ui/kit';
import { AssignTeacherDialogComponent } from './assign-teacher-dialog.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiButtonModule,
  TuiDataListWrapperModule,
  TuiDropdownModule,
  TuiMultiSelectModule,
  TuiTextfieldControllerModule,
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ...NGRX, ...TAIGA_UI],
  declarations: [AssignTeacherDialogComponent],
  exports: [AssignTeacherDialogComponent],
})
export class AssignTeacherDialogModule {}
