import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WebShellFeatureModule } from '@teaching-scheduling-system/web/shell/feature';
import {
  TuiRootModule,
  TuiDialogModule,
  TuiNotificationsModule,
} from '@taiga-ui/core';

import { AppComponent } from './app.component';

const TAIGA_UI = [TuiRootModule, TuiDialogModule, TuiNotificationsModule];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    WebShellFeatureModule,
    ...TAIGA_UI,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [],
})
export class AppModule {}
