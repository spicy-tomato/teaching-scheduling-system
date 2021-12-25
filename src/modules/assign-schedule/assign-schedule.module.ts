import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignScheduleComponent } from './assign-schedule.component';
import { AssignScheduleRoutingModule } from './assign-schedule.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';
import * as fromFeedback from './state';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ReactiveComponentModule } from '@ngrx/component';
import { AssignScheduleFilterComponent } from './assign-schedule-filter/assign-schedule-filter.component';
import { AssignScheduleNeedAssignComponent } from './assign-schedule-need-assign/assign-schedule-need-assign.component';
import { AssignScheduleAssignedComponent } from './assign-schedule-assigned/assign-schedule-assigned.component';
import { TuiButtonModule, TuiExpandModule } from '@taiga-ui/core';

const NGRX = [
  ReactiveComponentModule,
  StoreModule.forFeature(
    fromFeedback.assignScheduleFeatureKey,
    fromFeedback.assignScheduleReducer
  ),
  EffectsModule.forFeature([fromFeedback.AssignScheduleEffects]),
];
const TAIGA_UI = [
  TuiSelectModule,
  TuiDataListWrapperModule,
  TuiButtonModule,
  TuiExpandModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AssignScheduleRoutingModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [
    AssignScheduleComponent,
    AssignScheduleFilterComponent,
    AssignScheduleNeedAssignComponent,
    AssignScheduleAssignedComponent,
  ],
})
export class AssignScheduleModule {}
