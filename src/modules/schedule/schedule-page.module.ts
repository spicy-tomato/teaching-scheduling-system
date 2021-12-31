import { NgModule } from '@angular/core';
import { SchedulePageComponent } from './schedule-page.component';
import { TssScheduleComponent } from './schedule/schedule.component';
import { ScheduleRoutingModule } from './schedule-page.routes';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';

import * as fromSchedule from './state';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveComponentModule } from '@ngrx/component';
import {
  TuiCalendarMonthModule,
  TuiDataListWrapperModule,
  TuiMultiSelectModule,
} from '@taiga-ui/kit';
import { TuiHostedDropdownModule } from '@taiga-ui/core';
import { ScheduleHeaderComponent } from './schedule/schedule-header/schedule-header.component';
import { TuiRadioLabeledModule } from '@taiga-ui/kit';
import { DirectivesModule } from '@directives/directives.module';
import { SharedScheduleModule } from './shared/shared-schedule.module';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';

const NGRX = [
  ReactiveComponentModule,
  StoreModule.forFeature(
    fromSchedule.scheduleFeatureKey,
    fromSchedule.scheduleReducer
  ),
  EffectsModule.forFeature([fromSchedule.ScheduleEffects]),
];
const TAIGA_UI = [
  TuiHostedDropdownModule,
  TuiCalendarMonthModule,
  TuiRadioLabeledModule,
  TuiMultiSelectModule,
  TuiActiveZoneModule,
  TuiDataListWrapperModule,
];

@NgModule({
  imports: [
    ScheduleRoutingModule,
    ScheduleModule,
    DirectivesModule,
    SharedScheduleModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [
    SchedulePageComponent,
    TssScheduleComponent,
    ScheduleHeaderComponent,
  ],
})
export class SchedulePageModule {}
