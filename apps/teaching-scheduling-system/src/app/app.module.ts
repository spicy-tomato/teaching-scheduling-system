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
import { DeviceHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { VERSION_TOKEN } from '@teaching-scheduling-system/core/utils/providers';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { dbConfig } from '../db/db-config';

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
const disableAnimations =
  !('animate' in document.documentElement) ||
  (navigator && DeviceHelper.isOldIosVersion());

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule.withConfig({ disableAnimations }),
    WebShellFeatureModule,
    LoaderModule,
    ...TAIGA_UI,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerImmediately',
    }),
    NgxIndexedDBModule.forRoot(dbConfig)
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
    {
      provide: VERSION_TOKEN,
      useValue: environment.version
    },
  ],
})
export class AppModule {}
