import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule, TuiSvgModule } from '@taiga-ui/core';

@NgModule({
  imports: [
    CommonModule,
    TuiButtonModule,
    TuiDataListModule,
    TuiHostedDropdownModule,
    TuiSvgModule
  ],
  declarations: [NavbarComponent],
  exports: [NavbarComponent]
})
export class NavbarModule { }
