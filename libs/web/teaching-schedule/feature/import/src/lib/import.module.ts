import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule } from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiFilesModule,
  TuiInputFilesModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { StatisticImportScheduleStore } from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { ImportComponent } from './import.component';

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
    RouterModule.forChild([{ path: '', component: ImportComponent }]),
    ReactiveFormsModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [ImportComponent],
  providers: [StatisticImportScheduleStore],
})
export class ImportModule {}
