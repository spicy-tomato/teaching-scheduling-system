import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  TeachingScheduleAssignEffects,
  teachingScheduleAssignFeatureKey,
  teachingScheduleAssignReducer,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { AssignFilterModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/assign-filter';
import { AssignLeftTitleModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/assign-left-title';
import { AssignListModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/assign-list';
import { AssignResultModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/assign-result';
import { AssignRightTitleModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/assign-right-title';
import { AssignTableModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/assign-table';
import { AssignComponent } from './assign.component';

const NGRX = [
  StoreModule.forFeature(
    teachingScheduleAssignFeatureKey,
    teachingScheduleAssignReducer
  ),
  EffectsModule.forFeature([TeachingScheduleAssignEffects]),
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: AssignComponent }]),
    AssignFilterModule,
    AssignLeftTitleModule,
    AssignListModule,
    AssignResultModule,
    AssignRightTitleModule,
    AssignTableModule,
    ...NGRX,
  ],
  declarations: [AssignComponent],
})
export class AssignModule {}
