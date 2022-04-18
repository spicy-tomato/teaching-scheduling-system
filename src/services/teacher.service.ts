import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel, SimpleModel, SimpleTeacher } from 'src/shared/models';
import { BaseDataService } from './core/base-data.service';

@Injectable({
  providedIn: 'root',
})
export class TeacherService extends BaseDataService {
  constructor(private http: HttpClient) {
    super();
  }

  public getByDepartment(department: string): Observable<SimpleModel[]> {
    return this.http.get<SimpleModel[]>(
      this.url + `teachers?id_department[equal]=${department}`
    );
  }

  public getTeacherInfo(
    teacherId: string
  ): Observable<ResponseModel<SimpleTeacher>> {
    return this.http.get<ResponseModel<SimpleTeacher>>(
      this.url + `teachers/${teacherId}`
    );
  }
}
