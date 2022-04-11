import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AcademicYear, ResponseModel, SimpleMapModel, SimpleModel } from 'src/shared/models';
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

  public getFaculties(): Observable<
    ResponseModel<SimpleMapModel<string, SimpleModel[]>[]>
  > {
    return this.http.get<
      ResponseModel<SimpleMapModel<string, SimpleModel[]>[]>
    >(this.url + 'faculties');
  }

  public getRooms(): Observable<string[]> {
    const cache = this.localDataService.getRooms();
    if (cache) {
      return of(cache);
    }

    return this.http
      .get<string[]>(this.url + 'rooms')
      .pipe(tap((data) => this.localDataService.setRooms(data)));
  }
}
