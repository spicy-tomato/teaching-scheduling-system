import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { TuiAccordionModule } from '@taiga-ui/kit';
import {
  TuiLinkModule,
  TuiModeModule,
  TuiScrollbarModule,
} from '@taiga-ui/core';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '@directives/directives.module';

const TAIGA_UI = [
  TuiAccordionModule,
  TuiLinkModule,
  TuiModeModule,
  TuiScrollbarModule,
];

@NgModule({
  imports: [CommonModule, RouterModule, DirectivesModule, ...TAIGA_UI],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
})
export class SidebarModule {}
