import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AcademicYear } from '@models/core/academic-year.model';
import { Faculty } from '@models/core/faculty.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcademicYearDta } from 'src/shared/dtas/academic-year.dta';
import { FacultyDta } from 'src/shared/dtas/faculty.dta';
import { BaseDataService } from './core/base-data.service';

@Injectable({
  providedIn: 'root',
})
export class CommonInfoService extends BaseDataService {
  constructor(private http: HttpClient) {
    super();
  }

  public getFaculty(): Observable<Faculty[]> {
    return this.http
      .get<FacultyDta[]>(this.url + 'faculty')
      .pipe(map((result) => result.map((x) => Faculty.parse(x))));
  }

  public getAcademicYear(): Observable<AcademicYear[]> {
    return this.http
      .get<AcademicYearDta[]>(this.url + 'academic-year')
      .pipe(map((result) => result.map((x) => AcademicYear.parse(x))));
  }
}
