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
  TuiDataListModule,
  TuiHintModule,
  TuiLoaderModule,
  TuiScrollbarModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiCheckboxLabeledModule,
  TuiPaginationModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '@pipes/pipes.module';
import { RequestsOptionsComponent } from './requests-options/requests-options.component';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { RequestsPaginationComponent } from './requests-pagination/requests-pagination.component';

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
  TuiPaginationModule,
  TuiSelectModule,
  TuiDataListModule,
  TuiTextfieldControllerModule,
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
  declarations: [
    RequestsComponent,
    RequestsOptionsComponent,
    RequestsListComponent,
    RequestsPaginationComponent,
  ],
})
export class RequestsModule {}
