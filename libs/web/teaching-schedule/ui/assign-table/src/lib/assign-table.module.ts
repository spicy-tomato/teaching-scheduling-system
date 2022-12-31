import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiLoaderModule, TuiScrollbarModule } from '@taiga-ui/core';
import { TuiCheckboxModule } from '@taiga-ui/kit';
import { AssignTableComponent } from './assign-table.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiCheckboxModule,
  TuiLetModule,
  TuiLoaderModule,
  TuiScrollbarModule,
  TuiTableModule,
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
