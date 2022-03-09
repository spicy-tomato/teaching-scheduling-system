import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ChangePassword,
  ResponseModel,
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

  public me(): Observable<ResponseModel<Teacher>> {
    return this.http.get<ResponseModel<Teacher>>(this.url + 'me');
  }

  public changePassword(body: ChangePassword): Observable<void> {
    return this.http.post<void>(this.url + 'account/change-password', body);
  }

  public sendFeedback(body: SendFeedback): Observable<void> {
    return this.http.post<void>(this.url + 'feedbacks/send-feedback', body);
  }
}
