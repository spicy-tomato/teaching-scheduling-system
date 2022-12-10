import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  AppConfig,
  APP_CONFIG,
} from '@teaching-scheduling-system/web/config/data-access';
import {
  AuthResponse,
  LoginForm,
  ResponseModel,
  Teacher,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
  auth(loginData: LoginForm): Observable<AuthResponse> {
    const obj = { username: loginData.username, password: loginData.password };
    return this.http
      .post<ResponseModel<Nullable<Teacher>>>(this.url + 'login', obj, {
        observe: 'response',
      })
      .pipe(
        map(({ headers, body }) => {
          return {
            token: headers.get('Authorization') ?? '',
            teacher: body?.data || null,
          };
        })
      );
  }

  logOut(): Observable<void> {
    return this.http.post<void>(this.url + 'logout', {});
  }
}
