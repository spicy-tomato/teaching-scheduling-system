import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  AppConfig, APP_CONFIG
} from '@teaching-scheduling-system/web/config/data-access';
import { InterceptorCustomHeader } from '@teaching-scheduling-system/web/shared/utils';
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
    this.url = config.baseUrl + 'import-data/';
  }

  public importSchedule(
    file: File,
    departmentId: string,
    studySession: string
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): Observable<Object> {
    const headers = new HttpHeaders().set(
      InterceptorCustomHeader.skipContentType,
      'true'
    );
    const formData = new FormData();
    formData.append('file', file);
    formData.append('study_session', studySession);
    formData.append('id_department', departmentId);

    return this.http.post(this.url + 'schedule', formData, { headers });
  }
}
