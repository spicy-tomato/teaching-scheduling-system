import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { BellModule } from '@teaching-scheduling-system/web/notification/ui/bell';
import { MobileSidebarModule } from '@teaching-scheduling-system/web/shell/ui/mobile-sidebar';
import { NavbarNamePipeModule } from './navbar-name/navbar-name.module';
import { NavbarComponent } from './navbar.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiSvgModule,
  TuiSidebarModule,
  TuiActiveZoneModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NavbarNamePipeModule,
    MobileSidebarModule,
    BellModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
})
export class NavbarModule {}
