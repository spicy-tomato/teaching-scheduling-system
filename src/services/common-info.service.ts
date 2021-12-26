import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AcademicYear } from '@models/core/academic-year.model';
import { CommonInfoModel } from '@models/core/common-info.model';
import { Faculty } from '@models/core/faculty.model';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FacultyDta } from 'src/shared/dtas/faculty.dta';
import { BaseDataService } from './core/base-data.service';

@Injectable({
  providedIn: 'root',
})
export class CommonInfoService extends BaseDataService {
  constructor(
    private readonly http: HttpClient,
    private readonly localDataService: LocalDataService
  ) {
    super();
  }

  public getFaculty(): Observable<Faculty[]> {
    return this.http
      .get<FacultyDta[]>(this.url + 'faculty')
      .pipe(map((result) => result.map((x) => Faculty.parse(x))));
  }

  public getAcademicYear(): Observable<AcademicYear> {
    const cache = this.localDataService.getAcademicYear();
    if (cache) {
      return of(cache);
    }

    return this.http
      .get<AcademicYear>(this.url + 'academic-year2')
      .pipe(tap((data) => this.localDataService.setAcademicYear(data)));
  }

  public getCommonInfo(): Observable<CommonInfoModel> {
    const cache = this.localDataService.getCommonInfo();
    if (cache) {
      return of(cache);
    }

    return this.http
      .get<CommonInfoModel>(this.url + 'common-info')
      .pipe(tap((data) => this.localDataService.setCommonInfo(data)));
  }

  public getCurrentTerm(): Observable<string> {
    return of('2021-2022-2');
  }

  public getUniversity(): Observable<string[]> {
    return of(['Chính quy', 'Vừa học vừa làm', 'Thạc sỹ']);
  }
}
