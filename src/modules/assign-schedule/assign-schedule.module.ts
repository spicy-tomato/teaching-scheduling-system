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

const NGRX = [
  ReactiveComponentModule,
  StoreModule.forFeature(
    fromFeedback.assignScheduleFeatureKey,
    fromFeedback.assignScheduleReducer
  ),
  EffectsModule.forFeature([fromFeedback.AssignScheduleEffects]),
];
const TAIGA_UI = [TuiSelectModule, TuiDataListWrapperModule];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AssignScheduleRoutingModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [AssignScheduleComponent],
})
export class AssignScheduleModule {}
