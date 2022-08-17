import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeVi from '@angular/common/locales/vi';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { L10n, loadCldr, setCulture } from '@syncfusion/ej2-base';
import { TuiMobileCalendarDialogModule } from '@taiga-ui/addon-mobile';
import { TuiAlertModule, TuiDialogModule, TuiRootModule } from '@taiga-ui/core';
import { TuiInputDateModule } from '@taiga-ui/kit';
import { WebShellFeatureModule } from '@teaching-scheduling-system/web/shell/feature';
import { LoaderModule } from '@teaching-scheduling-system/web/shell/ui/loader';
import * as gregorian from 'cldr-data/main/vi/ca-gregorian.json';
import * as numbers from 'cldr-data/main/vi/numbers.json';
import * as timeZoneNames from 'cldr-data/main/vi/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import { RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { default as EJS_LOCALE } from '../assets/locales/ejs-locale.json';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';

registerLocaleData(localeVi, 'vi');
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);
L10n.load({ vi: EJS_LOCALE.vi });
setCulture('vi');

const TAIGA_UI = [
  TuiAlertModule,
  TuiDialogModule,
  TuiInputDateModule,
  TuiMobileCalendarDialogModule,
  TuiRootModule,
];
@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    WebShellFeatureModule,
    LoaderModule,
    ...TAIGA_UI,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      },
    },
  ],
})
export class AppModule {}
