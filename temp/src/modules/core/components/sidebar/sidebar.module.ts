import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { TuiAccordionModule } from '@taiga-ui/kit';
import {
  TuiLinkModule,
  TuiLoaderModule,
  TuiModeModule,
  TuiScrollbarModule,
} from '@taiga-ui/core';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '@directives/directives.module';
import { ReactiveComponentModule } from '@ngrx/component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiAccordionModule,
  TuiLinkModule,
  TuiModeModule,
  TuiScrollbarModule,
  TuiLoaderModule,
];

@NgModule({
  imports: [CommonModule, RouterModule, DirectivesModule, ...NGRX, ...TAIGA_UI],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
})
export class SidebarModule {}
