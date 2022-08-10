import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { InterceptorCustomHeader } from '@teaching-scheduling-system/core/utils/interceptors';
import {
  AppConfig,
  APP_CONFIG,
} from '@teaching-scheduling-system/web/config/data-access';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  // PRIVATE PROPERTIES
  private readonly url: string;

  // CONSTRUCTOR
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    this.url = config.baseUrl + 'import-data/';
  }

  importSchedule(
    file: File,
    departmentId: string,
    studySession: string
  ): Observable<void> {
    const headers = new HttpHeaders().set(
      InterceptorCustomHeader.skipContentType,
      'true'
    );
    const formData = new FormData();
    formData.append('file', file);
    formData.append('study_session', studySession);
    formData.append('id_department', departmentId);

    return this.http.post<void>(this.url + 'schedule', formData, { headers });
  }
}
