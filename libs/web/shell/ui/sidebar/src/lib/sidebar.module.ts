import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import {
  TuiLinkModule,
  TuiLoaderModule,
  TuiModeModule,
  TuiScrollbarModule,
} from '@taiga-ui/core';
import { TuiAccordionModule } from '@taiga-ui/kit';
import { PermissionDirectiveModule } from '@teaching-scheduling-system/web/shared/directives/permission';
import { SidebarComponent } from './sidebar.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiAccordionModule,
  TuiLinkModule,
  TuiModeModule,
  TuiScrollbarModule,
  TuiLoaderModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PermissionDirectiveModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
})
export class SidebarModule {}
