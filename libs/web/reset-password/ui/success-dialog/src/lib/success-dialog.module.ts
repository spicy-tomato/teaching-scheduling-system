import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { SuccessDialogComponent } from './success-dialog.component';

const TAIGA_UI = [TuiButtonModule];

@NgModule({
  imports: [CommonModule, ...TAIGA_UI],
  declarations: [SuccessDialogComponent],
  exports: [SuccessDialogComponent],
})
export class SuccessDialogModule {}
