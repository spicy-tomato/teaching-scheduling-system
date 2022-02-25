import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TeacherDataDta } from '@shared/dtas';
import {
  ChangePassword,
  Nullable,
  SendFeedback,
  Teacher,
} from 'src/shared/models';
import { BaseDataService } from './core/base-data.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseDataService {
  constructor(private http: HttpClient) {
    super();
  }

  public me(): Observable<Nullable<Teacher>> {
    return this.http
      .get<TeacherDataDta>(this.url + 'me')
      .pipe(map((response) => Teacher.parse(response.data)));
  }

  public changePassword(body: ChangePassword): Observable<void> {
    return this.http.post<void>(this.url + 'account/change-password', body);
  }

  public sendFeedback(body: SendFeedback): Observable<void> {
    return this.http.post<void>(this.url + 'feedbacks/send-feedback', body);
  }
}
