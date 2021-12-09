import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '@models/core/teacher.model';
import { AuthResponse } from '@models/login/auth-response.model';
import { LoginForm } from '@models/login/login-form.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TeacherDta } from 'src/shared/dtas/teacher.dta';
import { BaseDataService } from './base-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseDataService {
  constructor(protected http: HttpClient) {
    super();
  }

  public auth(loginData: LoginForm): Observable<AuthResponse> {
    const obj = { username: loginData.email, password: loginData.password };
    return this.http
      .post<TeacherDta>(this.url + 'auth/login', obj, { observe: 'response' })
      .pipe(
        map((response) => {
          return {
            token: response.headers.get('Authorization') ?? '',
            teacher: Teacher.parse(response.body),
          };
        })
      );
  }
}
