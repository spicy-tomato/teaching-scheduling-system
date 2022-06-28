import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@teaching-scheduling-system/web/config/data-access';
import {
  AcademicData,
  ResponseModel,
  SimpleMapModel,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommonInfoService {
  /** PRIVATE PROPERTIES */
  private readonly url: string;

  /** CONSTRUCTOR */
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) private readonly config: AppConfig
  ) {
    this.url = config.baseUrl;
  }

  public getAcademicYear(): Observable<AcademicData[]> {
    return this.http
      .get<ResponseModel<AcademicData[]>>(this.url + 'training-types')
      .pipe(map((response) => response.data));
  }

  public getCurrentTerm(): Observable<string> {
    return of(this.config.currentTerm);
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
