import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignLeftTitleComponent } from './assign-left-title.component';
import { TuiSelectModule } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { ReactiveComponentModule } from '@ngrx/component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiSelectModule,
  TuiDataListModule,
  TuiButtonModule,
  TuiTextfieldControllerModule,
];

@NgModule({
  imports: [CommonModule, FormsModule, ...NGRX, ...TAIGA_UI],
  declarations: [AssignLeftTitleComponent],
  exports: [AssignLeftTitleComponent],
})
export class AssignLeftTitleModule {}
