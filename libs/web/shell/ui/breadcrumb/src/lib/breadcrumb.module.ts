import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { TuiLinkModule } from '@taiga-ui/core';
import { TuiBreadcrumbsModule } from '@taiga-ui/kit';
import { BreadcrumbComponent } from './breadcrumb.component';

const TAIGA_UI = [TuiBreadcrumbsModule, TuiLinkModule];
const NGRX = [ReactiveComponentModule];

@NgModule({
  imports: [CommonModule, RouterModule, ...NGRX, ...TAIGA_UI],
  declarations: [BreadcrumbComponent],
  exports: [BreadcrumbComponent],
})
export class BreadcrumbModule {}
