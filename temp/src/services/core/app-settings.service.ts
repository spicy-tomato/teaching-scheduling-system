import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppSettings } from 'src/shared/models';

export let APP_SETTINGS: AppSettings;

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  constructor(private httpClient: HttpClient) {}

  public loadAppSettings(): Observable<AppSettings> {
    const filePath = '/assets/settings/app-settings.json';

    return this.httpClient.get<AppSettings>(filePath).pipe(
      tap((settings) => {
        APP_SETTINGS = settings;
      })
    );
  }
}
