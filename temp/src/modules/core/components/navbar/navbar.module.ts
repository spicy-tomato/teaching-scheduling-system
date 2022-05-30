import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from '@pipes/pipes.module';
import { ReactiveComponentModule } from '@ngrx/component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiSvgModule,
];

@NgModule({
  imports: [CommonModule, RouterModule, PipesModule, ...NGRX, ...TAIGA_UI],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
})
export class NavbarModule {}
