import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AcademicYear } from '@models/core/academic-year.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcademicYearDta } from 'src/dtas/academic-year.dta';
import { BaseDataService } from './base-data.service';

@Injectable({
  providedIn: 'root',
})
export class CommonInfoService extends BaseDataService {
  constructor(protected http: HttpClient) {
    super();
  }

  public getFaculty(): Observable<unknown> {
    return this.http.get<unknown>(this.url + 'faculty');
  }

  public getAcademicYear(): Observable<AcademicYear[]> {
    return this.http
      .get<AcademicYearDta[]>(this.url + 'academic-year')
      .pipe(
        map(x =>
          x.map((x) => AcademicYear.parse(x))
        )
      );
  }
}
