import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsComponent } from './requests.component';
import { RequestsRoutingModule } from './requests.routes';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as fromRequests from './state';
import { TuiTableModule } from '@taiga-ui/addon-table';
import {
  TuiButtonModule,
  TuiHintModule,
  TuiLoaderModule,
  TuiScrollbarModule,
} from '@taiga-ui/core';
import { TuiCheckboxLabeledModule } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '@pipes/pipes.module';

const NGRX = [
  ReactiveComponentModule,
  StoreModule.forFeature(
    fromRequests.requestsFeatureKey,
    fromRequests.requestsReducer
  ),
  EffectsModule.forFeature([fromRequests.RequestsEffects]),
];

const TAIGA_UI = [
  TuiTableModule,
  TuiLoaderModule,
  TuiScrollbarModule,
  TuiCheckboxLabeledModule,
  TuiButtonModule,
  TuiHintModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RequestsRoutingModule,
    PipesModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [RequestsComponent],
})
export class RequestsModule {}
