import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { APP_CONFIG } from '@teaching-scheduling-system/web/config/data-access';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

fetch('/assets/settings/app-settings.json')
  .then((res) => res.json())
  .then((config) => {
    if (environment.production) {
      enableProdMode();
    }

    platformBrowserDynamic([{ provide: APP_CONFIG, useValue: config }])
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  });
