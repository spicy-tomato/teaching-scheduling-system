import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiFilterPipeModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiLinkModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiInputModule, TuiTextAreaModule } from '@taiga-ui/kit';
import { VarDirectiveModule } from '@teaching-scheduling-system/core/directives/var';
import { CalendarDateTimePipeModule } from '@teaching-scheduling-system/web/calendar/ui/calendar-date-time-pipe';
import { ChangeStatusTypePipeModule } from '@teaching-scheduling-system/web/calendar/ui/change-status-type-pipe';
import { QuickInfoContentComponent } from './quick-info-content.component';
import { QuickInfoContentEventComponent } from './quick-info-content-event/quick-info-content-event.component';
import { QuickInfoContentCellComponent } from './quick-info-content-cell/quick-info-content-cell.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiButtonModule,
  TuiFilterPipeModule,
  TuiInputModule,
  TuiLinkModule,
  TuiTextAreaModule,
  TuiTextfieldControllerModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    VarDirectiveModule,
    CalendarDateTimePipeModule,
    ChangeStatusTypePipeModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [
    QuickInfoContentComponent,
    QuickInfoContentEventComponent,
    QuickInfoContentCellComponent,
  ],
  exports: [QuickInfoContentComponent],
})
export class QuickInfoContentModule {}
