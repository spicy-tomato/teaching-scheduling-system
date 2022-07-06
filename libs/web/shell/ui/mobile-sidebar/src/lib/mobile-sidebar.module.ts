import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  TuiButtonModule,
  TuiLinkModule,
  TuiModeModule,
  TuiScrollbarModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TuiAccordionModule } from '@taiga-ui/kit';
import { PermissionDirectiveModule } from '@teaching-scheduling-system/web/shared/directives/permission';
import { MobileSidebarComponent } from './mobile-sidebar.component';

const TAIGA_UI = [
  TuiAccordionModule,
  TuiButtonModule,
  TuiModeModule,
  TuiLinkModule,
  TuiScrollbarModule,
  TuiSvgModule,
];

@NgModule({
  imports: [CommonModule, RouterModule, PermissionDirectiveModule, ...TAIGA_UI],
  declarations: [MobileSidebarComponent],
  exports: [MobileSidebarComponent],
})
export class MobileSidebarModule {}
