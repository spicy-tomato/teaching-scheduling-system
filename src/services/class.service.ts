import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from './base-data.service';

@Injectable({
  providedIn: 'root'
})
export class ClassService extends BaseDataService {
  constructor(protected http: HttpClient) { 
    super();
  }

  public getModuleClass(): Observable<unknown> {
    return this.http.get<unknown>(this.url + 'module-class');
  }

  public getManagementClass(params: {
    academic_year: string,
    faculty: string;
  }): Observable<unknown> {
    return this.http.get<unknown>(this.url + 'faculty-class', { params });
  }
}
