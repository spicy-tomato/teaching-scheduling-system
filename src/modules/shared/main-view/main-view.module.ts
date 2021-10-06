import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as fromMainView from './state';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { TuiLinkModule } from '@taiga-ui/core';
import { TuiBreadcrumbsModule } from '@taiga-ui/kit';

import { MainViewComponent } from './main-view.component';
import { MainViewRoutingModule } from './main-view.routes';

@NgModule({
  imports: [
    CommonModule,
    MainViewRoutingModule,
    TuiBreadcrumbsModule,
    TuiLinkModule,
    StoreModule.forFeature(
      fromMainView.mainViewFeatureKey,
      fromMainView.mainViewReducer
    ),
    EffectsModule.forFeature([fromMainView.MainViewEffects])
  ],
  declarations: [MainViewComponent],
  exports: [MainViewComponent]
})
export class MainViewModule { }
