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
  TuiDialogModule,
} from '@taiga-ui/core';
import {
  TuiSelectModule,
  TuiDataListWrapperModule,
  TuiInputFilesModule,
} from '@taiga-ui/kit';
import { AssignScheduleAssignedComponent as AssignScheduleResultAssignedComponent } from './assign-schedule-result-assigned/assign-schedule-result-assigned.component';
import { AssignScheduleResultFilterComponent } from './assign-schedule-result-filter/assign-schedule-result-filter.component';
import { AssignScheduleResultLeftTitleComponent } from './assign-schedule-result-left-title/assign-schedule-result-left-title.component';
import { AssignScheduleResultNeedAssignComponent } from './assign-schedule-result-need-assign/assign-schedule-result-need-assign.component';
import { AssignScheduleResultRightTitleComponent } from './assign-schedule-result-right-title/assign-schedule-result-right-title.component';
import { AssignScheduleResultRoutingModule } from './assign-schedule-result.routes';
import { AssignScheduleSharedModule } from './shared/assign-schedule-shared.module';

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
  TuiInputFilesModule,
  TuiDialogModule,
];

@NgModule({
  imports: [
    AssignScheduleResultRoutingModule,
    AssignScheduleSharedModule,
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
