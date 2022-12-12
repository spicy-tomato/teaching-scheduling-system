import {
  HttpClient,
  HttpParameterCodec,
  HttpParams,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  AppConfig,
  APP_CONFIG,
} from '@teaching-scheduling-system/web/config/data-access';
import {
  GoogleCalendar,
  GoogleCalendarEventResponse,
  ResponseModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleService {
  // PRIVATE PROPERTIES
  private readonly url: string;

  // CONSTRUCTOR
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    this.url = config.baseUrl;
  }

  // PUBLIC METHODS
  authenticate(uuid: string): Observable<ResponseModel<{ authUrl: string }>> {
    return this.http.get<ResponseModel<{ authUrl: string }>>(
      this.url + `v1/accounts/${uuid}/google-apis/calendar/authenticate`
    );
  }

  authorize(uuid: string, auth_code: string): Observable<void> {
    return this.http.post<void>(
      this.url + `v1/accounts/${uuid}/google-apis/calendar/authorize`,
      { auth_code }
    );
  }

  revoke(uuid: string): Observable<void> {
    return this.http.post<void>(
      this.url + `v1/accounts/${uuid}/google-apis/calendar/revoke`,
      {}
    );
  }

  //* To display on sidebar
  getCalendarList(uuid: string): Observable<ResponseModel<GoogleCalendar[]>> {
    return this.http.get<ResponseModel<GoogleCalendar[]>>(
      this.url + `v1/accounts/${uuid}/google-apis/calendar/calendars`
    );
  }

  //* To display on page Calendar
  getCalendarEvents(
    uuid: string,
    timeMin: string,
    timeMax: string
  ): Observable<ResponseModel<GoogleCalendarEventResponse[]>> {
    const params = new HttpParams({
      encoder: new CustomHttpParamEncoder(),
      fromObject: {
        timeMin,
        timeMax,
        singleEvents: 1,
        timeZone: '+07:00',
      },
    });
    return this.http.get<ResponseModel<GoogleCalendarEventResponse[]>>(
      this.url + `v1/accounts/${uuid}/google-apis/calendar/calendars/events`,
      { params }
    );
  }
}

// TODO: Remove
class CustomHttpParamEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
