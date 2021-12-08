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
import { PipesModule } from '@pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiCheckboxLabeledModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { ExamDialogComponent } from './schedule/exam-dialog/exam-dialog.component';
import {
  TuiButtonModule,
  TuiHintControllerModule,
  TuiHintModule,
} from '@taiga-ui/core';

const NGRX = [
  ReactiveComponentModule,
  StoreModule.forFeature(
    fromSchedule.scheduleFeatureKey,
    fromSchedule.scheduleReducer
  ),
  EffectsModule.forFeature([fromSchedule.ScheduleEffects]),
];
const TAIGA_UI = [
  TuiInputModule,
  TuiInputDateTimeModule,
  TuiCheckboxLabeledModule,
  TuiTextAreaModule,
  TuiHintControllerModule,
  TuiHintModule,
  TuiButtonModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ScheduleRoutingModule,
    ScheduleModule,
    PipesModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [
    SchedulePageComponent,
    TssScheduleComponent,
    ExamDialogComponent,
  ],
})
export class SchedulerPageModule {}
