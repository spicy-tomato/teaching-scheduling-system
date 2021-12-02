import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDiscardDialogComponent } from './form-discard-dialog.component';
import { TuiButtonModule } from '@taiga-ui/core';

@NgModule({
  imports: [CommonModule, TuiButtonModule],
  declarations: [FormDiscardDialogComponent],
})
export class FormDiscardDialogModule {}
