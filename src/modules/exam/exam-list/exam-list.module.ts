import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamListComponent } from './exam-list.component';
import { ExamListRoutingModule } from './exam-list.routes';
import {
  TuiButtonModule,
  TuiHintControllerModule,
  TuiHintModule,
  TuiLoaderModule,
  TuiScrollbarModule,
} from '@taiga-ui/core';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { ReactiveFormsModule } from '@angular/forms';
import { ExamListFilterComponent } from './exam-list-filter/exam-list-filter.component';
import { ExamListTableComponent } from './exam-list-table/exam-list-table.component';
import {
  TuiDataListWrapperModule,
  TuiInputDateRangeModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { ReactiveComponentModule } from '@ngrx/component';
import { ExamStore } from '../state/exam.store';
import { AssignExamDialogModule } from './assign-exam-dialog/assign-exam-dialog.module';
import { EditExamDialogModule } from './edit-exam-dialog/edit-exam-dialog.module';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiScrollbarModule,
  TuiLoaderModule,
  TuiTableModule,
  TuiSelectModule,
  TuiDataListWrapperModule,
  TuiButtonModule,
  TuiInputDateRangeModule,
  TuiLoaderModule,
  TuiHintModule,
  TuiHintControllerModule,
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ExamListRoutingModule,
    AssignExamDialogModule,
    EditExamDialogModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [
    ExamListComponent,
    ExamListFilterComponent,
    ExamListTableComponent,
  ],
  providers: [ExamStore],
})
export class ExamListModule {}
