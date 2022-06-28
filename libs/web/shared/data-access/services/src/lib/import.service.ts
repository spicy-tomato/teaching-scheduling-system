import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    this.url = config.baseUrl + 'import-data/';
  }

  public importSchedule(
    file: File,
    departmentId: string,
    studySession: string
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): Observable<Object> {
    const formData = new FormData();
    // formData.append('file', file);
    formData.append('study_session', studySession);
    formData.append('id_department', departmentId);

    console.log(formData.getAll('file'));
    console.log(formData.getAll('study_session'));
    console.log(formData.getAll('id_department'));

    return this.http.post(this.url + 'schedule', formData);
  }
}
