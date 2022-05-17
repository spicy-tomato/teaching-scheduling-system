import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AcademicYear,
  ResponseModel,
  SimpleMapModel,
  SimpleModel,
} from 'src/shared/models';
import { AppSettingsService } from './core/app-settings.service';
import { BaseDataService } from './core/base-data.service';

@Injectable({
  providedIn: 'root',
})
export class CommonInfoService extends BaseDataService {
  constructor(
    private readonly http: HttpClient,
    private readonly appSettingsService: AppSettingsService
  ) {
    super();
  }

  public getAcademicYear(): Observable<AcademicYear[]> {
    return this.http
      .get<ResponseModel<AcademicYear[]>>(this.url + 'training-types')
      .pipe(map((response) => response.data));
  }

  public getCurrentTerm(): Observable<string> {
    return this.appSettingsService
      .loadAppSettings()
      .pipe(map((settings) => settings.currentTerm));
  }

  public getFaculties(): Observable<
    ResponseModel<SimpleMapModel<string, SimpleModel[]>[]>
  > {
    return this.http.get<
      ResponseModel<SimpleMapModel<string, SimpleModel[]>[]>
    >(this.url + 'faculties');
  }

  public getRooms(): Observable<string[]> {
    return this.http
      .get<ResponseModel<string[]>>(this.url + 'rooms')
      .pipe(map((r) => r.data));
  }
}
