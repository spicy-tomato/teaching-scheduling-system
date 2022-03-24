import { NgModule } from '@angular/core';
import { AssignScheduleResultComponent } from './assign-schedule-result.component';
import * as fromAssignSchedule from './state';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  TuiButtonModule,
  TuiExpandModule,
  TuiTextfieldControllerModule,
  TuiDataListModule,
} from '@taiga-ui/core';
import { TuiSelectModule, TuiDataListWrapperModule } from '@taiga-ui/kit';
import { AssignScheduleAssignedComponent as AssignScheduleResultAssignedComponent } from './assign-schedule-result-assigned/assign-schedule-result-assigned.component';
import { AssignScheduleResultFilterComponent } from './assign-schedule-result-filter/assign-schedule-result-filter.component';
import { AssignScheduleResultLeftTitleComponent } from './assign-schedule-result-left-title/assign-schedule-result-left-title.component';
import { AssignScheduleResultNeedAssignComponent } from './assign-schedule-result-need-assign/assign-schedule-result-need-assign.component';
import { AssignScheduleResultRightTitleComponent } from './assign-schedule-result-right-title/assign-schedule-result-right-title.component';
import { AssignScheduleResultRoutingModule } from './assign-schedule-result.routes';
import { AssignScheduleResultSharedModule } from './shared/assign-schedule-result-shared.module';

const NGRX = [
  StoreModule.forFeature(
    fromAssignSchedule.assignScheduleFeatureKey,
    fromAssignSchedule.assignScheduleReducer
  ),
  EffectsModule.forFeature([fromAssignSchedule.AssignScheduleEffects]),
];
const TAIGA_UI = [
  TuiSelectModule,
  TuiDataListWrapperModule,
  TuiButtonModule,
  TuiExpandModule,
  TuiTextfieldControllerModule,
  TuiDataListModule,
];

@NgModule({
  imports: [
    AssignScheduleResultRoutingModule,
    AssignScheduleResultSharedModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [
    AssignScheduleResultFilterComponent,
    AssignScheduleResultNeedAssignComponent,
    AssignScheduleResultAssignedComponent,
    AssignScheduleResultLeftTitleComponent,
    AssignScheduleResultRightTitleComponent,
    AssignScheduleResultComponent,
  ],
})
export class AssignScheduleResultModule {}
