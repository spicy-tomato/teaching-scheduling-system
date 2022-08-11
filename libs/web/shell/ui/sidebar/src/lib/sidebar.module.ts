import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  TuiLinkModule,
  TuiModeModule,
  TuiScrollbarModule,
} from '@taiga-ui/core';
import { TuiAccordionModule, TuiCheckboxLabeledModule } from '@taiga-ui/kit';
import { PermissionDirectiveModule } from '@teaching-scheduling-system/web/shared/directives/permission';
import { SidebarComponent } from './sidebar.component';

const TAIGA_UI = [
  TuiAccordionModule,
  TuiCheckboxLabeledModule,
  TuiLinkModule,
  TuiModeModule,
  TuiScrollbarModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PermissionDirectiveModule,
    ...TAIGA_UI,
  ],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
})
export class SidebarModule {}
