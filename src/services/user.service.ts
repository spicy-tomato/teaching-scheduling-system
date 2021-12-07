import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '@models/core/teacher.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TeacherDta } from 'src/dtas/teacher.dta';
import { BaseDataService } from './core/base-data.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseDataService {
  constructor(private http: HttpClient) {
    super();
  }

  public me(): Observable<Teacher | undefined> {
    return this.http
      .get<TeacherDta>(this.url + 'users')
      .pipe(map((response) => Teacher.parse(response)));
  }
}
