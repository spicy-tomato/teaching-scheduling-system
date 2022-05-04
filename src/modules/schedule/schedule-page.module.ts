import { NgModule } from '@angular/core';
import { SchedulePageComponent } from './schedule-page.component';
import { TssScheduleComponent } from './schedule/schedule.component';
import { ScheduleRoutingModule } from './schedule-page.routes';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';

import * as fromSchedule from './state';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  TuiCalendarMonthModule,
  TuiMultiSelectModule,
  TuiRadioLabeledModule,
} from '@taiga-ui/kit';
import {
  TuiExpandModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { TuiActiveZoneModule, TuiFilterPipeModule } from '@taiga-ui/cdk';

import { ScheduleHeaderComponent } from './schedule/schedule-header/schedule-header.component';
import { DirectivesModule } from '@directives/directives.module';
import { SharedScheduleModule } from './shared/shared-schedule.module';

const NGRX = [
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
  TuiExpandModule,
  TuiLoaderModule,
  TuiLinkModule,
  TuiFilterPipeModule,
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
