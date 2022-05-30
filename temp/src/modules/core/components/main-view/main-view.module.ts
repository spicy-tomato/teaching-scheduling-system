import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as fromMainView from './state';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { TuiLinkModule, TuiScrollbarModule } from '@taiga-ui/core';
import { TuiBreadcrumbsModule } from '@taiga-ui/kit';

import { MainViewComponent } from './main-view.component';
import { MainViewRoutingModule } from './main-view.routes';
import { ReactiveComponentModule } from '@ngrx/component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

const TAIGA_UI = [TuiBreadcrumbsModule, TuiLinkModule, TuiScrollbarModule];
const NGRX = [
  StoreModule.forFeature(
    fromMainView.mainViewFeatureKey,
    fromMainView.mainViewReducer
  ),
  EffectsModule.forFeature([fromMainView.MainViewEffects]),
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveComponentModule,
    MainViewRoutingModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  declarations: [MainViewComponent, BreadcrumbComponent],
  exports: [MainViewComponent],
})
export class MainViewModule {}
