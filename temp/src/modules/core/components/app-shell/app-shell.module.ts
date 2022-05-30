import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShellComponent } from './app-shell.component';
import { AppShellRoutingModule } from './app-shell.routes';
import { SidebarModule } from '@modules/core/components/sidebar/sidebar.module';
import { NavbarModule } from '@modules/core/components/navbar/navbar.module';
import { MainViewModule } from '@modules/core/components/main-view/main-view.module';
import * as fromAppShell from './state';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

const NGRX = [
  StoreModule.forFeature(
    fromAppShell.appShellFeatureKey,
    fromAppShell.appShellReducer
  ),
  EffectsModule.forFeature([fromAppShell.AppShellEffects]),
];

@NgModule({
  imports: [
    CommonModule,
    AppShellRoutingModule,
    SidebarModule,
    NavbarModule,
    MainViewModule,
    ...NGRX,
  ],
  declarations: [AppShellComponent],
})
export class AppShellModule {}
