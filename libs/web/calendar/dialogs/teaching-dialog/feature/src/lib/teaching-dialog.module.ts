import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiScrollbarModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { RecreateViewKeyDirectiveModule } from '@teaching-scheduling-system/core/directives/recreate-view-key';
import { TeachingDialogContentModule } from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/ui/teaching-dialog-content';
import { TeachingDialogNavigationModule } from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/ui/teaching-dialog-navigation';
import { TeachingHistoryDirectiveModule } from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/ui/teaching-history';
import { TeachingDialogComponent } from './teaching-dialog.component';

const TAIGA_UI = [
  TuiActiveZoneModule,
  TuiButtonModule,
  TuiScrollbarModule,
  TuiSidebarModule,
  TuiSvgModule,
];

@NgModule({
  imports: [
    CommonModule,
    TeachingDialogNavigationModule,
    TeachingDialogContentModule,
    RecreateViewKeyDirectiveModule,
    TeachingHistoryDirectiveModule,
    ...TAIGA_UI,
  ],
  declarations: [TeachingDialogComponent],
  exports: [TeachingDialogComponent],
})
export class TeachingDialogModule {}
