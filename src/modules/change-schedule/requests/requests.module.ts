import { NgModule } from '@angular/core';
import { RequestsComponent } from './requests.component';
import { RequestsRoutingModule } from './requests.routes';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as fromRequests from './state';
import { TuiTableModule } from '@taiga-ui/addon-table';
import {
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
import { PipesModule } from '@pipes/pipes.module';
import { RequestsOptionsComponent } from './requests-options/requests-options.component';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { RequestsPaginationComponent } from './requests-pagination/requests-pagination.component';
import { SharedRequestsModule } from './_shared/shared-requests.module';
import { SharedChangeScheduleModule } from '../_shared/shared.module';
import { RequestListStatusComponent } from './requests-list/request-list-status/request-list-status.component';
import { DirectivesModule } from '@directives/directives.module';
import { RequestListActionComponent } from './requests-list/request-list-action/request-list-action.component';

const NGRX = [
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
  TuiHintModule,
  TuiPaginationModule,
  TuiSelectModule,
  TuiDataListModule,
  TuiTextfieldControllerModule,
];

@NgModule({
  imports: [
    SharedChangeScheduleModule,
    RequestsRoutingModule,
    SharedRequestsModule,
    PipesModule,
    DirectivesModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [
    RequestsComponent,
    RequestsOptionsComponent,
    RequestsListComponent,
    RequestsPaginationComponent,
    RequestListStatusComponent,
    RequestListActionComponent,
  ],
})
export class RequestsModule {}
