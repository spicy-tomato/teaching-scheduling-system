import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AuthResponse,
  LoginForm,
  Nullable,
  ResponseModel,
  Teacher,
} from 'src/shared/models';
import { BaseDataService } from './base-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseDataService {
  constructor(protected http: HttpClient) {
    super();
  }

  public auth(loginData: LoginForm): Observable<AuthResponse> {
    const obj = { username: loginData.username, password: loginData.password };
    return this.http
      .post<ResponseModel<Nullable<Teacher>>>(this.url + 'auth/login', obj, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return {
            token: response.headers.get('Authorization') ?? '',
            teacher: response.body?.data || null,
          };
        })
      );
  }

  public logOut(): Observable<void> {
    return this.http.post<void>(this.url + 'auth/logout', {});
  }
}
