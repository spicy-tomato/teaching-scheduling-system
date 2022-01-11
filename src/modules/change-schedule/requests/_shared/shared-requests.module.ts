import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DenyDialogComponent } from './deny-dialog/deny-dialog.component';
import { TuiTextAreaModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';

const EXPORT = [FormsModule, ReactiveFormsModule];
const COMPONENTS = [DenyDialogComponent];
const EXPORT_TAIGA_UI = [TuiButtonModule];
const TAIGA_UI = [TuiTextAreaModule, ...EXPORT_TAIGA_UI];

@NgModule({
  imports: [CommonModule, ...EXPORT, ...TAIGA_UI],
  declarations: [...COMPONENTS],
  exports: [...EXPORT, ...EXPORT_TAIGA_UI],
})
export class SharedRequestsModule {}
