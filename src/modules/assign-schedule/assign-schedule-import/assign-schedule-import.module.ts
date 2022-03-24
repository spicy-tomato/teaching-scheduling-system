import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignScheduleImportComponent } from './assign-schedule-import.component';
import { AssignScheduleImportRoutingModule } from './assign-schedule-import.routes';
import {
  TuiDataListWrapperModule,
  TuiFilesModule,
  TuiInputFilesModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';
import { ReactiveComponentModule } from '@ngrx/component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiInputFilesModule,
  TuiFilesModule,
  TuiButtonModule,
  TuiSelectModule,
  TuiDataListWrapperModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AssignScheduleImportRoutingModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [AssignScheduleImportComponent],
})
export class AssignScheduleImportModule {}
