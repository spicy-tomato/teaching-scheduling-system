import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  AppConfig,
  APP_CONFIG,
} from '@teaching-scheduling-system/web/config/data-access';
import {
  ChangePassword,
  Feedback,
  ResponseModel,
  Teacher,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /** PRIVATE PROPERTIES */
  private readonly url: string;

  /** CONSTRUCTOR */
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    this.url = config.baseUrl;
  }

  public me(): Observable<ResponseModel<Teacher>> {
    return this.http.get<ResponseModel<Teacher>>(this.url + 'me');
  }

  public changePassword(uuid: string, body: ChangePassword): Observable<void> {
    return this.http.patch<void>(
      this.url + `accounts/change-password/${uuid}`,
      body
    );
  }

  public sendFeedback(body: Feedback): Observable<void> {
    return this.http.post<void>(this.url + 'feedback/create', body);
  }

  public updateInformation(
    body: Record<string, string>,
    id: string
  ): Observable<void> {
    return this.http.patch<void>(this.url + `accounts/update/${id}`, body);
  }
}
