import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  AppShellEffects,
  appShellFeatureKey,
  appShellReducer,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { MainViewModule } from '@teaching-scheduling-system/web/shell/ui/main-view';
import { NavbarModule } from '@teaching-scheduling-system/web/shell/ui/navbar';
import { SidebarModule } from '@teaching-scheduling-system/web/shell/ui/sidebar';
import { LayoutComponent } from './layout.component';

const NGRX = [
  StoreModule.forFeature(appShellFeatureKey, appShellReducer),
  EffectsModule.forFeature([AppShellEffects]),
];

@NgModule({
  imports: [
    CommonModule,
    NavbarModule,
    SidebarModule,
    MainViewModule,
    ...NGRX,
  ],
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
})
export class LayoutModule {}
