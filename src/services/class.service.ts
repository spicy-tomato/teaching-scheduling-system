import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManagingClass } from '@models/core/managing-class.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ManagingClassDta } from 'src/dtas/managing-class.dta';
import { BaseDataService } from './base-data.service';

@Injectable({
  providedIn: 'root'
})
export class ClassService extends BaseDataService {
  constructor(protected http: HttpClient) {
    super();
  }

  public getModuleClass(idTeacher: string): Observable<unknown> {
    return this.http.get<unknown>(this.url + `module-class/${idTeacher}`);
  }

  public getManagingClass(params: {
    academic_year: string,
    faculty: string;
  }): Observable<ManagingClass[]> {
    return this.http
      .get<ManagingClassDta[]>(this.url + 'faculty-class', { params })
      .pipe(
        map(result =>
          result.map(x => ManagingClass.parse(x))
        )
      );
  }
}
