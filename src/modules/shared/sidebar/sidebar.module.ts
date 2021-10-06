import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { TuiAccordionModule } from '@taiga-ui/kit';
import { TuiLinkModule, TuiModeModule, TuiScrollbarModule } from '@taiga-ui/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TuiAccordionModule,
    TuiLinkModule,
    TuiModeModule,
    TuiScrollbarModule
  ],
  declarations: [SidebarComponent],
  exports: [SidebarComponent]
})
export class SidebarModule { }
