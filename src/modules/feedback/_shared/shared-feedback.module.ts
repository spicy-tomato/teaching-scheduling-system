import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { SuccessDialogHeaderComponent } from './success-dialog-header/success-dialog-header.component';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiButtonModule } from '@taiga-ui/core';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiButtonModule];

@NgModule({
  imports: [CommonModule, ...NGRX, ...TAIGA_UI],
  declarations: [SuccessDialogComponent, SuccessDialogHeaderComponent],
})
export class SharedFeedbackModule {}
