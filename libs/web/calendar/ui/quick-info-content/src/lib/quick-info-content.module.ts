import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiFilterPipeModule } from '@taiga-ui/cdk';
import { TuiLinkModule } from '@taiga-ui/core';
import { VarDirectiveModule } from '@teaching-scheduling-system/core/directives/var';
import { CalendarDateTimePipeModule } from '@teaching-scheduling-system/web/calendar/ui/calendar-date-time-pipe';
import { ChangeStatusTypePipeModule } from '@teaching-scheduling-system/web/calendar/ui/change-status-type-pipe';
import { QuickInfoContentComponent } from './quick-info-content.component';

const TAIGA_UI = [TuiLinkModule, TuiFilterPipeModule];

@NgModule({
  imports: [
    CommonModule,
    VarDirectiveModule,
    CalendarDateTimePipeModule,
    ChangeStatusTypePipeModule,
    ...TAIGA_UI,
  ],
  declarations: [QuickInfoContentComponent],
  exports: [QuickInfoContentComponent],
})
export class QuickInfoContentModule {}
