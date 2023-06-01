import { InjectionToken } from '@angular/core';

export interface AppEnv {
  production: boolean;
  recaptcha: {
    siteKey: string;
  };
  pusher: {
    key: string;
    cluster: string;
  };
  version: string;
  SYNCFUSION_LICENSE: string;
}

export const APP_ENV = new InjectionToken<AppEnv>('app.env');
