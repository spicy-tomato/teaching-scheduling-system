import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { TuiAccordionModule } from '@taiga-ui/kit';
import { TuiLinkModule, TuiScrollbarModule } from '@taiga-ui/core';

@NgModule({
  imports: [
    CommonModule,
    TuiAccordionModule,
    TuiLinkModule,
    TuiScrollbarModule
  ],
  declarations: [SidebarComponent],
  exports: [SidebarComponent]
})
export class SidebarModule { }
