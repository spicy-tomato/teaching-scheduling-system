import { Injectable } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject, filter, Observable, of, takeUntil, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
  deps: [TuiDestroyService],
})
export class GoogleService {
  /** PRIVATE PROPERTIES */
  private load$ = new BehaviorSubject<boolean | null>(null);
  loggedIn$ = new BehaviorSubject<boolean | null>(null);

  /** CONSTRUCTOR */
  constructor(private readonly destroy$: TuiDestroyService) {
    this.handleClientLoad();
  }

  /** PUBLIC METHODS */
  load(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      this.load$.next(true);
    };

    script.onerror = () => this.load$.next(false);
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  auth(): void {
    this.loggedIn$.next(null);
    void gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(
        (x: any) => {
          console.log(x);
          this.loggedIn$.next(true);
        },
        () => this.loggedIn$.next(false)
      );
  }

  signOut(): void {
    void gapi.auth2.getAuthInstance().signOut();
    this.loggedIn$.next(false);
  }

  getInfo(): gapi.auth2.CurrentUser {
    return gapi.auth2.getAuthInstance().currentUser;
  }

  private listUpcomingEvents(): Observable<
    gapi.client.HttpRequest<gapi.client.calendar.Events>
  > | null {
    if (!this.loggedIn$.value) return null;

    return of(
      gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      })
    );
  }

  /** PRIVATE METHODS */
  private handleClientLoad(): void {
    this.load$
      .pipe(
        filter((loaded) => !!loaded),
        tap(() => {
          gapi.load('client:auth2', () => this.initClient());
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private initClient(): void {
    // void gapi.client
    //   .init({
    //     apiKey: APP_SETTINGS.googleApiKey,
    //     clientId: APP_SETTINGS.googleApiClientId,
    //     discoveryDocs: [
    //       'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    //     ],
    //     scope: 'https://www.googleapis.com/auth/calendar',
    //   })
    //   .then(() => {
    //     // Listen for sign-in state changes.
    //     gapi.auth2
    //       .getAuthInstance()
    //       .isSignedIn.listen((isSignedIn) =>
    //         this.updateSignInStatus(isSignedIn)
    //       );
    //     // Handle the initial sign-in state.
    //     this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    //   });
  }

  private updateSignInStatus(isSignedIn: boolean): void {
    this.loggedIn$.next(isSignedIn);
  }
}
