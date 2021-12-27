import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExamScheduleModel } from '@models/schedule/exam-schedule.model';
import { SearchSchedule } from '@models/schedule/search-schedule.model';
import { StudyScheduleModel } from '@models/schedule/study-schedule.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExamScheduleDta } from 'src/shared/dtas/exam-schedule.dta';
import { StudyScheduleDta } from 'src/shared/dtas/study-schedule.dta';
import { BaseDataService } from './core/base-data.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService extends BaseDataService {
  constructor(private http: HttpClient) {
    super();
  }

  public getSchedule(params: SearchSchedule): Observable<StudyScheduleModel[]> {
    return this.http
      .get<StudyScheduleDta[]>(this.url + `teachers/and/schedules`, {
        params: { ...params },
      })
      .pipe(
        map((response) => {
          return response.map((x) => StudyScheduleModel.parse(x));
        })
      );
  }

  public getDepartmentSchedule(
    department: string,
    params: SearchSchedule
  ): Observable<StudyScheduleModel[]> {
    return this.http
      .get<StudyScheduleDta[]>(
        this.url + `departments/${department}/schedules`,
        {
          params: { ...params },
        }
      )
      .pipe(
        map((response) => {
          return response.map((x) => StudyScheduleModel.parse(x));
        })
      );
  }

  public getExamSchedule(): Observable<ExamScheduleModel[]> {
    return this.http
      .get<ExamScheduleDta[]>(this.url + 'teachers/0849/exam-schedules')
      .pipe(
        map((response) => {
          return response.map((x) => ExamScheduleModel.parse(x));
        })
      );
  }

  public getDepartmentExamSchedule(
    department: string
  ): Observable<ExamScheduleModel[]> {
    return this.http
      .get<ExamScheduleDta[]>(
        this.url + `departments/${department}/exam-schedules`
      )
      .pipe(
        map((response) => {
          return response.map((x) => ExamScheduleModel.parse(x));
        })
      );
  }

  public updateNote(body: Record<string, number | string>): Observable<void> {
    return this.http.put<void>(this.url + 'exam-schedules/update', body);
  }
}
