import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiEditorModule } from '@taiga-ui/addon-editor';
import { TuiButtonModule, TuiErrorModule, TuiSvgModule } from '@taiga-ui/core';
import {
  TuiFieldErrorPipeModule,
  TuiFilterModule,
  TuiInputModule,
  TuiIslandModule,
  TuiRadioBlockModule,
} from '@taiga-ui/kit';
import { FeedbackComponent } from './feedback.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiButtonModule,
  TuiEditorModule,
  TuiErrorModule,
  TuiFieldErrorPipeModule,
  TuiFilterModule,
  TuiInputModule,
  TuiIslandModule,
  TuiRadioBlockModule,
  TuiSvgModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: FeedbackComponent }]),
    ReactiveFormsModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [FeedbackComponent],
})
export class FeedbackModule {}
