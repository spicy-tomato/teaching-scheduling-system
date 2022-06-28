import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessDialogComponent } from './success-dialog.component';
import { TuiButtonModule } from '@taiga-ui/core';
import { ReactiveComponentModule } from '@ngrx/component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiButtonModule];

@NgModule({
  imports: [CommonModule, ...NGRX, ...TAIGA_UI],
  declarations: [SuccessDialogComponent],
  exports: [SuccessDialogComponent],
})
export class SuccessDialogModule {}
