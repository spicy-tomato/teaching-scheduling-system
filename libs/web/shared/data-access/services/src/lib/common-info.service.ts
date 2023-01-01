import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  AppConfig,
  APP_CONFIG,
} from '@teaching-scheduling-system/web/config/data-access';
import {
  AcademicData,
  ResponseModel,
  SimpleMapModel,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonInfoService {
  // PRIVATE PROPERTIES
  private readonly url: string;

  // CONSTRUCTOR
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) private readonly config: AppConfig
  ) {
    this.url = config.baseUrl;
  }

  getAcademicYear(): Observable<AcademicData[]> {
    return this.http
      .get<ResponseModel<AcademicData[]>>(this.url + 'training-types')
      .pipe(map(({ data }) => data));
  }

  getCurrentTerm(): Observable<string> {
    return of(this.config.currentTerm);
  }

  getFaculties(): Observable<
    ResponseModel<SimpleMapModel<string, SimpleModel[]>[]>
  > {
    return this.http.get<
      ResponseModel<SimpleMapModel<string, SimpleModel[]>[]>
    >(this.url + 'v1/faculties/with-departments');
  }

  getRooms(): Observable<string[]> {
    return this.http
      .get<ResponseModel<string[]>>(this.url + 'rooms')
      .pipe(map(({ data }) => data));
  }
}
