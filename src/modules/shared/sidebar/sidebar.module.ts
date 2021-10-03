import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { TuiAccordionModule } from '@taiga-ui/kit';
import { TuiExpandModule, TuiLinkModule, TuiModeModule, TuiScrollbarModule } from '@taiga-ui/core';

@NgModule({
  imports: [
    CommonModule,
    TuiAccordionModule,
    TuiExpandModule,
    TuiLinkModule,
    TuiModeModule,
    TuiScrollbarModule
  ],
  declarations: [SidebarComponent],
  exports: [SidebarComponent]
})
export class SidebarModule { }
