import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiTextAreaModule } from '@taiga-ui/kit';
import { ChangeDenyDialogComponent } from './change-deny-dialog.component';

const TAIGA_UI = [TuiTextAreaModule, TuiButtonModule];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ...TAIGA_UI],
  declarations: [ChangeDenyDialogComponent],
  exports: [ChangeDenyDialogComponent],
})
export class ChangeDenyDialogModule {}
