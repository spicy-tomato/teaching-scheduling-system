import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignScheduleTableComponent } from './assign-schedule-table/assign-schedule-table.component';
import { TuiTableModule } from '@taiga-ui/addon-table';
import {
  TuiAppearance,
  TuiLoaderModule,
  TuiScrollbarModule,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { TuiCheckboxModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';

const EXPORT_NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiTableModule,
  TuiScrollbarModule,
  TuiCheckboxModule,
  TuiLoaderModule,
];
const EXPORT = [CommonModule, FormsModule, ReactiveFormsModule];
const COMPONENTS = [AssignScheduleTableComponent];

@NgModule({
  imports: [...EXPORT, ...EXPORT_NGRX, ...TAIGA_UI],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS, ...EXPORT, ...EXPORT_NGRX],
  providers: [
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        shape: null,
        appearance: TuiAppearance.Primary,
        size: 's',
      },
    },
  ],
})
export class AssignScheduleSharedModule {}
