import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import {
  TuiButtonModule,
  TuiDropdownControllerModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiMultiSelectModule } from '@taiga-ui/kit';
import { AssignTeacherDialogComponent } from './assign-teacher-dialog.component';
import { AssignTeacherDialogStore } from './store';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiButtonModule,
  TuiDataListWrapperModule,
  TuiDropdownControllerModule,
  TuiMultiSelectModule,
  TuiTextfieldControllerModule,
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ...NGRX, ...TAIGA_UI],
  declarations: [AssignTeacherDialogComponent],
  exports: [AssignTeacherDialogComponent],
  providers: [AssignTeacherDialogStore],
})
export class AssignTeacherDialogModule {}
