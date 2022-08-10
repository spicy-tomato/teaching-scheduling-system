import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  AppConfig,
  APP_CONFIG,
} from '@teaching-scheduling-system/web/config/data-access';
import { Observable } from 'rxjs';
import { GetNotificationParams } from '../models';
import { NotificationPage } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // PRIVATE PROPERTIES
  private readonly url: string;

  // CONSTRUCTOR
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    this.url = config.baseUrl;
  }

  getAll(
    idAccount: string,
    params: GetNotificationParams
  ): Observable<NotificationPage> {
    return this.http.get<NotificationPage>(
      this.url + `v1/accounts/${idAccount}/notifications`,
      { params }
    );
  }

  getUnread(
    idAccount: string,
    params: GetNotificationParams
  ): Observable<NotificationPage> {
    return this.http.get<NotificationPage>(
      this.url + `v1/accounts/${idAccount}/notifications/unread`,
      { params }
    );
  }

  markAllAsRead(idAccount: string): Observable<void> {
    return this.http.put<void>(
      this.url + `v1/accounts/${idAccount}/notifications/mark-as-read`,
      {}
    );
  }

  markAsRead(idAccount: string, idNotification: number): Observable<void> {
    return this.http.patch<void>(
      this.url +
        `v1/accounts/${idAccount}/notifications/${idNotification}/mark-as-read`,
      {}
    );
  }
}
