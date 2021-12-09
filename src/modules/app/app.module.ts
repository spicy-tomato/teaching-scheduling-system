import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';

import {
  TuiDialogModule,
  TuiNotificationsModule,
  TuiRootModule,
} from '@taiga-ui/core';
import { TUI_DIALOG_CLOSES_ON_BACK, TUI_SANITIZER } from '@taiga-ui/cdk';
import { TUI_LANGUAGE, TUI_VIETNAMESE_LANGUAGE } from '@taiga-ui/i18n';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  defaultEditorExtensions,
  TUI_EDITOR_EXTENSIONS,
} from '@taiga-ui/addon-editor';

import { environment } from '@environments/environment';
import { AppSettingsService } from '@services/core/app-settings.service';
import { loadAppSettings } from '@factories/load-app-settings.factory';
import { InterceptorsModule } from '@interceptors/interceptors.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { HeaderInterceptor } from '@interceptors/header.interceptor';

const TAIGA_UI = [TuiRootModule, TuiDialogModule, TuiNotificationsModule];
const NGRX = [
  StoreModule.forRoot({ router: routerReducer }, {}),
  StoreDevtoolsModule.instrument({
    maxAge: 25,
    logOnly: environment.production,
  }),
  EffectsModule.forRoot([]),
  StoreRouterConnectingModule.forRoot(),
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    InterceptorsModule,
    AppRoutingModule,
    ...NGRX,
    ...TAIGA_UI,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadAppSettings,
      multi: true,
      deps: [AppSettingsService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true,
    },
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_VIETNAMESE_LANGUAGE),
    },
    {
      provide: TUI_DIALOG_CLOSES_ON_BACK,
      useValue: of(false),
    },
    {
      provide: TUI_SANITIZER,
      useClass: NgDompurifySanitizer,
    },
    {
      provide: TUI_EDITOR_EXTENSIONS,
      useValue: defaultEditorExtensions,
    },
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
