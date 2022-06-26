import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiScrollbarModule } from '@taiga-ui/core';
import { BreadcrumbModule } from '@teaching-scheduling-system/web/shell/ui/breadcrumb';
import { MainViewComponent } from './main-view.component';

const NGRX = [ReactiveComponentModule];
const TAIGA_UI = [TuiScrollbarModule];

@NgModule({
  imports: [CommonModule, RouterModule, BreadcrumbModule, ...NGRX, ...TAIGA_UI],
  declarations: [MainViewComponent],
  exports: [MainViewComponent],
})
export class MainViewModule {}
