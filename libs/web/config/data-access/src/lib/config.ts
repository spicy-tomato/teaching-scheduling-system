import { InjectionToken } from '@angular/core';

export interface AppConfig {
  appTitle: string;
  baseUrl: string;
  currentTerm: string;
  googleApiKey: string;
  googleApiClientId: string;
  maintenance: boolean;
  maintenanceDate: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
