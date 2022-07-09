import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { APP_CONFIG } from '@teaching-scheduling-system/web/config/data-access';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Echo from 'laravel-echo';


(window as any).Pusher = require('pusher-js');


(window as any).Echo = new Echo({
  broadcaster: 'pusher',
  key: 'channel-key',
  cluster: 'cluster',
  encrypted: true,
  forceTLS: true,
  authEndpoint: 'http://localhost/education-supporting-system/public/api/auth',
  // authEndpoint: 'http://localhost/education-supporting-system/public/broadcasting/auth',
  // authEndpoint: 'http://localhost/education-supporting-system/public/channel/my-channel',


});

console.log(window);

(window as any).Echo.channel(`public-channel`)
  .listen('.public-event', (e: any) => {
    alert(e)
  });


(window as any).Echo.private(`my-channel`)
  .listen('.my-event', (e: any) => {
    alert(e)
  });



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
