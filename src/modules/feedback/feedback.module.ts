import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback.component';
import { FeedbackRoutingModule } from './feedback.routes';
import * as fromFeedback from './state';
import {
  TuiFieldErrorModule,
  TuiFilterModule,
  TuiInputModule,
  TuiIslandModule,
  TuiRadioBlockModule,
} from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiEditorModule } from '@taiga-ui/addon-editor';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedFeedbackModule } from './_shared/shared-feedback.module';

const NGRX = [
  ReactiveComponentModule,
  StoreModule.forFeature(
    fromFeedback.feedbackFeatureKey,
    fromFeedback.feedbackReducer
  ),
  EffectsModule.forFeature([fromFeedback.FeedbackEffects]),
];
const TAIGA_UI = [
  TuiIslandModule,
  TuiInputModule,
  TuiRadioBlockModule,
  TuiFilterModule,
  TuiSvgModule,
  TuiEditorModule,
  TuiButtonModule,
  TuiFieldErrorModule,
];

@NgModule({
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedFeedbackModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [FeedbackComponent],
})
export class FeedbackModule {}
