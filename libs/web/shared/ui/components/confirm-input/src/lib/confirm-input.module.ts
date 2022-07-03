import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButtonModule, TuiGroupModule, TuiHintModule } from '@taiga-ui/core';
import { TuiInputModule, TuiInputPhoneModule } from '@taiga-ui/kit';
import { ConfirmInputComponent } from './confirm-input.component';

const TAIGA_UI = [
  TuiButtonModule,
  TuiGroupModule,
  TuiHintModule,
  TuiInputModule,
  TuiInputPhoneModule,
];

@NgModule({
  imports: [CommonModule, FormsModule, ...TAIGA_UI],
  declarations: [ConfirmInputComponent],
  exports: [ConfirmInputComponent],
})
export class ConfirmInputModule {}
