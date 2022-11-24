import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  EchoService,
  NotificationEffects,
  notificationFeatureKey,
  notificationReducer,
} from '@teaching-scheduling-system/web/notification/data-access';
import {
  AppShellEffects,
  appShellFeatureKey,
  appShellReducer,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  SidebarEffects,
  sidebarFeatureKey,
  sidebarReducer,
} from '@teaching-scheduling-system/web/shell/data-access';
import { MainViewModule } from '@teaching-scheduling-system/web/shell/ui/main-view';
import { NavbarModule } from '@teaching-scheduling-system/web/shell/ui/navbar';
import { SidebarModule } from '@teaching-scheduling-system/web/shell/ui/sidebar';
import { VersionModule } from '@teaching-scheduling-system/web/shell/ui/version';
import { LayoutComponent } from './layout.component';

const NGRX = [
  StoreModule.forFeature(appShellFeatureKey, appShellReducer),
  StoreModule.forFeature(sidebarFeatureKey, sidebarReducer),
  StoreModule.forFeature(notificationFeatureKey, notificationReducer),
  EffectsModule.forFeature([
    AppShellEffects,
    SidebarEffects,
    NotificationEffects,
  ]),
];

@NgModule({
  imports: [
    CommonModule,
    NavbarModule,
    SidebarModule,
    MainViewModule,
    VersionModule,
    ...NGRX,
  ],
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
  providers: [EchoService],
})
export class LayoutModule {}
