import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ModuleClass,
  ResponseModel,
  SearchAssignSchedule,
} from 'src/shared/models';
import { BaseDataService } from './core/base-data.service';

@Injectable({
  providedIn: 'root',
})
export class ClassService extends BaseDataService {
  constructor(protected http: HttpClient) {
    super();
  }

  public getDepartmentModuleClass(
    department: string,
    params: SearchAssignSchedule
  ): Observable<ResponseModel<ModuleClass[]>> {
    return this.http.get<ResponseModel<ModuleClass[]>>(
      this.url + `departments/${department}/module-classes`,
      {
        params: { ...params },
      }
    );
  }

  public assign(idTeacher: string, idClass: string[]): Observable<void> {
    return this.http.put<void>(this.url + 'module-classes/update', {
      ids: idClass,
      id_teacher: idTeacher,
    });
  }

  public unassign(idClass: string[]): Observable<void> {
    return this.http.put<void>(this.url + 'module-classes/update', {
      ids: idClass,
      id_teacher: null,
    });
  }
}
