import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@teaching-scheduling-system/web/config/data-access';
import {
  ModuleClass,
  ResponseModel,
  SearchAssignSchedule,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  // PRIVATE PROPERTIES
  private readonly url: string;

  // CONSTRUCTOR
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    this.url = config.baseUrl;
  }

  getDepartmentModuleClass(
    department: string,
    params: SearchAssignSchedule
  ): Observable<ResponseModel<ModuleClass[]>> {
    return this.http.get<ResponseModel<ModuleClass[]>>(
      this.url + `departments/${department}/module-classes`,
      { params }
    );
  }

  assign(idTeacher: string, idClass: string[]): Observable<void> {
    return this.http.put<void>(this.url + 'module-classes/update', {
      ids: idClass,
      id_teacher: idTeacher,
    });
  }

  unassign(idClass: string[]): Observable<void> {
    return this.http.put<void>(this.url + 'module-classes/update', {
      ids: idClass,
      id_teacher: null,
    });
  }
}
