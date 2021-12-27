import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModuleClass } from '@models/class/module-class.model';
import { ManagingClass } from '@models/core/managing-class.model';
import { SearchSchedule } from '@models/schedule/search-schedule.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ManagingClassDta } from 'src/shared/dtas/managing-class.dta';
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
    params: SearchSchedule
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
}
