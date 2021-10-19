import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from './base-data.service';

@Injectable({
  providedIn: 'root'
})
export class CommonInfoService extends BaseDataService {
  constructor(protected http: HttpClient) {
    super();
  }

  public getFaculty(): Observable<unknown> {
    return this.http.get<unknown>(this.url + 'faculty');
  }

  public getAcademicYear(): Observable<unknown[]> {
    return this.http.get<unknown[]>(this.url + 'academic-year');
  }
}
