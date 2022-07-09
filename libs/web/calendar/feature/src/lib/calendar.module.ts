import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { TuiFilterPipeModule } from '@taiga-ui/cdk';
import { TuiLinkModule } from '@taiga-ui/core';
import { VarDirectiveModule } from '@teaching-scheduling-system/core/directives/var';
import { DialogModule } from '@teaching-scheduling-system/web-shared-ui-dialog';
import {
  CalendarEffects,
  calendarFeatureKey,
  calendarReducer,
} from '@teaching-scheduling-system/web/calendar/data-access';
import { ExamDialogModule } from '@teaching-scheduling-system/web/calendar/dialogs/exam-dialog/feature';
import { TeachingDialogModule } from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/feature';
import { CalendarDateTimePipeModule } from '@teaching-scheduling-system/web/calendar/ui/calendar-date-time-pipe';
import { CalendarHeaderModule } from '@teaching-scheduling-system/web/calendar/ui/calendar-header';
import { CalendarMenuModule } from '@teaching-scheduling-system/web/calendar/ui/calendar-menu';
import { ChangeStatusTypePipeModule } from '@teaching-scheduling-system/web/calendar/ui/change-status-type-pipe';
import { CalendarComponent } from './calendar.component';

const NGRX = [
  StoreModule.forFeature(calendarFeatureKey, calendarReducer),
  EffectsModule.forFeature([CalendarEffects]),
  ReactiveComponentModule,
];
const TAIGA_UI = [TuiLinkModule, TuiFilterPipeModule];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: CalendarComponent }]),
    ScheduleModule,
    TeachingDialogModule,
    ExamDialogModule,
    DialogModule,
    VarDirectiveModule,
    CalendarHeaderModule,
    CalendarMenuModule,
    CalendarDateTimePipeModule,
    ChangeStatusTypePipeModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [CalendarComponent],
})
export class CalendarModule {}
