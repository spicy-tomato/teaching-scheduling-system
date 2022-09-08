import { Inject, Injectable } from '@angular/core';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  AppConfig,
  APP_CONFIG,
} from '@teaching-scheduling-system/web/config/data-access';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleService {
  // PRIVATE PROPERTIES
  private gapi$ = new BehaviorSubject<boolean>(false);
  private gsi$ = new BehaviorSubject<boolean>(false);
  public load$ = combineLatest([this.gsi$]).pipe(
    map((x) => x.every((api) => api))
  );
  private tokenClient: any;

  public loggedIn$ = new BehaviorSubject<Nullable<boolean>>(false);
  public data$ = new BehaviorSubject<gapi.client.calendar.CalendarListEntry[]>(
    []
  );

  // CONSTRUCTOR
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {
    this.load$.pipe(tap((x) => this.loggedIn$.next(x || null)));
  }

  // PUBLIC METHODS
  public load(): void {
    this.loadGapi();
    this.loadGsi();
  }

  public auth(): void {
    this.loggedIn$.next(null);
    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      this.tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  signOut(): void {
    // void gapi.auth2.getAuthInstance().signOut();
    this.loggedIn$.next(false);
  }

  // PRIVATE METHODS
  private loadGapi(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      this.gapi$.next(true);
      gapi.load('client', () => this.initClient());
    };

    script.onerror = () => this.gapi$.next(false);
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  private loadGsi(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => {
      this.gsi$.next(true);
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.config.google.clientId,
        scope: 'https://www.googleapis.com/auth/calendar',
        callback: async (response: any) => {
          console.log(response);
          this.loggedIn$.next(true);
          await this.getCalendarList();
        },
      });
    };

    script.onerror = () => this.gsi$.next(false);
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  private async initClient(): Promise<void> {
    // await gapi.client.init({
    //   apiKey: 'AIzaSyBmz6CYk83uRm_jWArxF8EyMq9agXv_PgU',
    //   clientId:
    //     '805359619678-3834nds0gate8inbqa6qaehaueeno9hv.apps.googleusercontent.com',
    //   discoveryDocs: [
    //     'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    //   ],
    //   scope: 'https://www.googleapis.com/auth/calendar',
    // });
  }

  private async getCalendarList(): Promise<void> {
    // const list = await gapi.client.calendar.calendarList.list();
    // this.data$.next(list.result.items || []);
  }
}
