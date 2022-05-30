import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from './core/base-data.service';

@Injectable({
  providedIn: 'root',
})
export class ImportService extends BaseDataService {
  constructor(protected http: HttpClient) {
    super('import-data/');
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
