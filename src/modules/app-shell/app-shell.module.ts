import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShellComponent } from './app-shell.component';
import { AppShellRoutingModule } from './app-shell.routes';
import { SidebarModule } from '@modules/shared/sidebar/sidebar.module';
import { NavbarModule } from '@modules/shared/navbar/navbar.module';
import { MainViewModule } from '@modules/shared/main-view/main-view.module';

@NgModule({
  imports: [
    CommonModule,
    AppShellRoutingModule,
    SidebarModule,
    NavbarModule,
    MainViewModule
  ],
  declarations: [AppShellComponent],
})
export class AppShellModule { }
