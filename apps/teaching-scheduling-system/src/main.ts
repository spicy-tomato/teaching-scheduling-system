import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  APP_CONFIG,
  APP_ENV,
} from '@teaching-scheduling-system/web/config/data-access';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
registerLicense(environment.SYNCFUSION_LICENSE);

if (environment.production) {
  enableProdMode();
}

fetch('/assets/settings/app-settings.json')
  .then((res) => res.json())
  .then((config) => {
    platformBrowserDynamic([
      { provide: APP_CONFIG, useValue: config },
      { provide: APP_ENV, useValue: environment },
    ])
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  });
