import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ResponseModel,
  SimpleModel,
  SimpleTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  APP_CONFIG,
  AppConfig,
} from '@teaching-scheduling-system/web/config/data-access';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  // PRIVATE PROPERTIES
  private readonly url: string;

  // CONSTRUCTOR
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    this.url = config.baseUrl;
  }

  getByDepartment(
    department: string
  ): Observable<ResponseModel<SimpleModel[]>> {
    return this.http.get<ResponseModel<SimpleModel[]>>(
      this.url + `teachers?id_department[equal]=${department}`
    );
  }

  getTeacherInfo(teacherId: string): Observable<ResponseModel<SimpleTeacher>> {
    return this.http.get<ResponseModel<SimpleTeacher>>(
      this.url + `teachers/${teacherId}`
    );
  }
}
