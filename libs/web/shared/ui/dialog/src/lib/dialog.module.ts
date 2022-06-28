import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { VarDirectiveModule } from '@teaching-scheduling-system/core/directives/var';
import { ChangeScheduleHistoryComponent } from './change-schedule-history/change-schedule-history.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

const TAIGA_UI = [TuiButtonModule, TuiSvgModule];

@NgModule({
  imports: [CommonModule, VarDirectiveModule, ...TAIGA_UI],
  declarations: [ConfirmDialogComponent, ChangeScheduleHistoryComponent],
  exports: [ChangeScheduleHistoryComponent],
})
export class DialogModule {}
