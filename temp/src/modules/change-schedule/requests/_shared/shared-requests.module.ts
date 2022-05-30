import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DenyDialogComponent } from './deny-dialog/deny-dialog.component';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiInputDateRangeModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';
import { SetRoomDialogComponent } from './set-room-dialog/set-room-dialog.component';
import { ReactiveComponentModule } from '@ngrx/component';
import { PipesModule } from '@pipes/pipes.module';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';

const EXPORT = [FormsModule, ReactiveFormsModule, ReactiveComponentModule];
const COMPONENTS = [
  DenyDialogComponent,
  SetRoomDialogComponent,
  ExportDialogComponent,
];
const EXPORT_TAIGA_UI = [TuiButtonModule];
const TAIGA_UI = [
  TuiTextAreaModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiInputDateRangeModule,
  ...EXPORT_TAIGA_UI,
];
const NGRX = [ReactiveComponentModule];

@NgModule({
  imports: [CommonModule, PipesModule, ...NGRX, ...EXPORT, ...TAIGA_UI],
  declarations: [...COMPONENTS],
  exports: [...EXPORT, ...EXPORT_TAIGA_UI],
})
export class SharedRequestsModule {}
