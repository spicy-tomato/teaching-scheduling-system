import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShellComponent } from './app-shell.component';
import { AppShellRoutingModule } from './app-shell.routes';

@NgModule({
  imports: [
    CommonModule,
    AppShellRoutingModule
  ],
  declarations: [
    AppShellComponent
  ],
})
export class AppShellModule { }
