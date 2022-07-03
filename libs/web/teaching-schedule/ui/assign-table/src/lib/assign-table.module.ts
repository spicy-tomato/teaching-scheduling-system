import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignTableComponent } from './assign-table.component';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiLoaderModule, TuiScrollbarModule } from '@taiga-ui/core';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiCheckboxModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  declarations: [AssignTableComponent],
  exports: [AssignTableComponent],
})
export class AssignTableModule {}
