import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiHintModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { AssignEditDialogModule } from '@teaching-scheduling-system/web/exam/ui/assign-edit-dialog';
import { AssignTeacherDialogModule } from '@teaching-scheduling-system/web/exam/ui/assign-teacher-dialog';
import { AssignListComponent } from './assign-list.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiButtonModule,
  TuiHintModule,
  TuiLetModule,
  TuiLoaderModule,
  TuiTableModule,
];

@NgModule({
  imports: [
    CommonModule,
    AssignEditDialogModule,
    AssignTeacherDialogModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [AssignListComponent],
  exports: [AssignListComponent],
})
export class AssignListModule {}
