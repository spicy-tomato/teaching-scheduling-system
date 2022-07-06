import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ObjectHelper } from '@teaching-scheduling-system/core/utils/helpers';
import {
  AppConfig,
  APP_CONFIG,
} from '@teaching-scheduling-system/web/config/data-access';
import {
  ChangePassword,
  Feedback,
  ResetPassword,
  ResponseModel,
  Teacher,
  ValidateToken,
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

  public verifyResetPassword(body: ValidateToken): Observable<void> {
    return this.http.post<void>(this.url + 'v1/verify-reset-password', body);
  }

  public requestResetPassword(email: string): Observable<void> {
    return this.http.post<void>(this.url + 'v1/request-reset-password', {
      email,
    });
  }

  public resetPassword(body: ResetPassword): Observable<void> {
    return this.http.patch<void>(
      this.url + 'v1/reset-password',
      ObjectHelper.toSnakeCase(body)
    );
  }
}
