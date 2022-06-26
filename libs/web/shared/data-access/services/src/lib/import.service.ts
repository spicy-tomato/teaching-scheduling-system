import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@teaching-scheduling-system/web/config/data-access';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  /** PRIVATE PROPERTIES */
  private readonly url: string;

  /** CONSTRUCTOR */
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    this.url = config.baseUrl;
  }

  public importSchedule(
    file: File,
    departmentId: string,
    studySession: string
  ): Observable<void> {
    const formData = this.appendData(file);
    formData.append('study_session', studySession);
    return this.http.post<void>(this.url + 'schedule', formData);
  }

  private appendData(file: File): FormData {
    const formData = new FormData();
    formData.append('file', file);
    return formData;
  }
}
