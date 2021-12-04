import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulePageComponent } from './schedule-page.component';
import { TssScheduleComponent } from './schedule/schedule.component';
import { ScheduleRoutingModule } from './schedule-page.routes';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';

import * as fromSchedule from './state';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveComponentModule } from '@ngrx/component';

const NGRX = [
  ReactiveComponentModule,
  StoreModule.forFeature(
    fromSchedule.scheduleFeatureKey,
    fromSchedule.scheduleReducer
  ),
  EffectsModule.forFeature([fromSchedule.ScheduleEffects]),
];

@NgModule({
  imports: [CommonModule, ScheduleRoutingModule, ScheduleModule, ...NGRX],
  declarations: [SchedulePageComponent, TssScheduleComponent],
})
export class SchedulerPageModule {}
