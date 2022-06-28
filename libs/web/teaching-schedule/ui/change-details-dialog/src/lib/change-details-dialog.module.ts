import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetailsDialogComponent } from './change-details-dialog.component';
import { TuiSvgModule } from '@taiga-ui/core';
import { VarDirectiveModule } from '@teaching-scheduling-system/core/directives/var';
import { StatusColorPipeModule } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-status-color-pipe';

const TAIGA_UI = [TuiSvgModule];

@NgModule({
  imports: [
    CommonModule,
    VarDirectiveModule,
    StatusColorPipeModule,
    ...TAIGA_UI,
  ],
  declarations: [ChangeDetailsDialogComponent],
  exports: [ChangeDetailsDialogComponent],
})
export class ChangeDetailsDialogModule {}
