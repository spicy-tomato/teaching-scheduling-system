import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AcademicYear } from '@models/core/academic-year.model';
import { Faculty } from '@models/core/faculty.model';
import { SimpleMapModel } from '@models/core/simple-map.model';
import { SimpleModel } from '@models/core/simple.model';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FacultyDta } from 'src/shared/dtas/faculty.dta';
import { AppSettingsService } from './core/app-settings.service';
import { BaseDataService } from './core/base-data.service';
import { LocalDataService } from './core/local-data.service';

@Injectable({
  providedIn: 'root',
})
export class CommonInfoService extends BaseDataService {
  constructor(
    private readonly http: HttpClient,
    private readonly appSettingsService: AppSettingsService,
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

  public getCurrentTerm(): Observable<string> {
    const cache = this.localDataService.getCurrentTerm();
    if (cache) {
      return of(cache);
    }

    return this.appSettingsService.loadAppSettings().pipe(
      map((settings) => settings.currentTerm),
      tap((currentTerm) => {
        this.localDataService.setCurrentTerm(currentTerm);
      })
    );
  }

  public getDepartments(): Observable<SimpleMapModel<string, SimpleModel[]>[]> {
    return of([
      {
        id: 'CNTT',
        name: 'Công nghệ thông tin',
        value: [
          {
            id: 'MHT',
            name: 'Mạng máy tính',
          },
          {
            id: 'CNM',
            name: 'Công nghệ phần mềm',
          },
        ],
      },
      {
        id: 'CT',
        name: 'Công trình',
        value: [
          {
            id: 'CDO',
            name: 'Cầu đường bộ',
          },
        ],
      },
    ]);
  }
}
