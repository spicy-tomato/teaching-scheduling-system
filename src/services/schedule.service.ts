import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScheduleModel } from '@models/schedule/schedule.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScheduleDta } from 'src/dtas/schedule.dta';
import { BaseDataService } from './core/base-data.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService extends BaseDataService {
  constructor(private http: HttpClient) {
    super();
  }

  public getExamSchedule(): Observable<ScheduleModel[]> {
    return this.http
      .get<ScheduleDta[]>(this.url + 'teachers/0849/exam-schedules')
      .pipe(
        map((response) => {
          return response.map((x) => ScheduleModel.parse(x, 'exam'));
        })
      );
  }
}
