import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignScheduleTableComponent } from './assign-schedule-table/assign-schedule-table.component';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiLoaderModule, TuiScrollbarModule } from '@taiga-ui/core';
import { TuiCheckboxModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiTableModule,
  TuiScrollbarModule,
  TuiCheckboxModule,
  TuiLoaderModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [AssignScheduleTableComponent],
  exports: [AssignScheduleTableComponent],
})
export class AssignScheduleSharedModule {}
