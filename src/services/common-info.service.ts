import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AcademicYear } from '@models/core/academic-year.model';
import { Faculty } from '@models/core/faculty.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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

  public getAcademicYear(): Observable<AcademicYear> {
    return this.http.get<AcademicYear>(this.url + 'academic-year2');
  }

  public getSchoolYear(): Observable<string[]> {
    return of(['2019-2020', '2020-2021', '2021-2022']);
  }

  public getUniversity(): Observable<string[]> {
    return of(['Chính quy', 'Vừa học vừa làm', 'Thạc sỹ']);
  }
}
