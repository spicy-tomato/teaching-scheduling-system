import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiScrollbarModule } from '@taiga-ui/core';
import { RecreateViewKeyDirectiveModule } from '@teaching-scheduling-system/core/directives/recreate-view-key';
import { TeachingDialogContentModule } from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/ui/teaching-dialog-content';
import { TeachingDialogNavigationModule } from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/ui/teaching-dialog-navigation';
import { TeachingDialogComponent } from './teaching-dialog.component';

const TAIGA_UI = [TuiScrollbarModule];

@NgModule({
  imports: [
    CommonModule,
    TeachingDialogNavigationModule,
    TeachingDialogContentModule,
    RecreateViewKeyDirectiveModule,
    ...TAIGA_UI,
  ],
  declarations: [TeachingDialogComponent],
  exports: [TeachingDialogComponent],
})
export class TeachingDialogModule {}
