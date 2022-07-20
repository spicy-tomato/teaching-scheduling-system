import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { VarDirectiveModule } from '@teaching-scheduling-system/core/directives/var';
import { DialogModule } from '@teaching-scheduling-system/web-shared-ui-dialog';
import {
  CalendarEffects,
  calendarFeatureKey,
  calendarReducer,
} from '@teaching-scheduling-system/web/calendar/data-access';
import { ExamDialogModule } from '@teaching-scheduling-system/web/calendar/dialogs/exam-dialog/feature';
import { TeachingDialogModule } from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/feature';
import { CalendarHeaderModule } from '@teaching-scheduling-system/web/calendar/ui/calendar-header';
import { CalendarMenuModule } from '@teaching-scheduling-system/web/calendar/ui/calendar-menu';
import { QuickInfoContentModule } from '@teaching-scheduling-system/web/calendar/ui/quick-info-content';
import { QuickInfoHeaderModule } from '@teaching-scheduling-system/web/calendar/ui/quick-info-header';
import { CalendarComponent } from './calendar.component';

const NGRX = [
  StoreModule.forFeature(calendarFeatureKey, calendarReducer),
  EffectsModule.forFeature([CalendarEffects]),
  ReactiveComponentModule,
];

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
    QuickInfoHeaderModule,
    QuickInfoContentModule,
    ...NGRX,
  ],
  declarations: [CalendarComponent],
})
export class CalendarModule {}
