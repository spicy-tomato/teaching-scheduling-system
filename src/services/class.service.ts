import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ManagingClassDta } from '@shared/dtas';
import {
  ManagingClass,
  ModuleClass,
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

  public getModuleClass(idTeacher: string): Observable<unknown> {
    return this.http.get<unknown>(this.url + `module-class/${idTeacher}`);
  }

  public getManagingClass(params: {
    academic_year: string;
    faculty: string;
  }): Observable<ManagingClass[]> {
    return this.http
      .get<ManagingClassDta[]>(this.url + 'faculty-class', { params })
      .pipe(map((result) => result.map((x) => ManagingClass.parse(x))));
  }

  public getDepartmentModuleClass(
    department: string,
    params: SearchAssignSchedule
  ): Observable<ModuleClass[]> {
    return this.http.get<ModuleClass[]>(
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
