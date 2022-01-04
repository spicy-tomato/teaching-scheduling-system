import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExamScheduleDta, StudyScheduleDta } from '@shared/dtas';
import {
  ChangeScheduleResponse,
  ChangeScheduleSearch,
  ExamScheduleModel,
  SearchSchedule,
  StudyScheduleModel,
} from 'src/shared/models';
import { BaseDataService } from './core/base-data.service';
import { RequestChangeSchedulePayload } from '@shared/models/schedule/request-change-schedule-payload.model';
import { ObjectHelper } from '@shared/helpers';
import { ChangeScheduleResponsePayload } from '@shared/models/change-schedule/change-schedule-response-payload.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService extends BaseDataService {
  constructor(private http: HttpClient) {
    super();
  }

  public getSchedule(params: SearchSchedule): Observable<StudyScheduleModel[]> {
    return this.http
      .get<StudyScheduleDta[]>(this.url + `teachers/4603/schedules`, {
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

  public getExamSchedule(
    params: SearchSchedule
  ): Observable<ExamScheduleModel[]> {
    return this.http
      .get<ExamScheduleDta[]>(this.url + 'teachers/0849/exam-schedules', {
        params: { ...params },
      })
      .pipe(
        map((response) => {
          return response.map((x) => ExamScheduleModel.parse(x));
        })
      );
  }

  public getDepartmentExamSchedule(
    department: string,
    params: SearchSchedule
  ): Observable<ExamScheduleModel[]> {
    return this.http
      .get<ExamScheduleDta[]>(
        this.url + `departments/${department}/exam-schedules`,
        {
          params: { ...params },
        }
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

  public requestChangeSchedule(
    body: RequestChangeSchedulePayload
  ): Observable<void> {
    return this.http.post<void>(
      this.url + 'fixed-schedules/create',
      ObjectHelper.toSnakeCase(body)
    );
  }

  public getChangeScheduleRequests(
    params: ChangeScheduleSearch
  ): Observable<ChangeScheduleResponse> {
    return this.http.get<ChangeScheduleResponse>(this.url + 'fixed-schedules', {
      params: { ...params },
    });
  }

  public responseChangeScheduleRequests(
    body: ChangeScheduleResponsePayload
  ): Observable<void> {
    return this.http.put<void>(
      this.url + 'fixed-schedules/update',
      ObjectHelper.toSnakeCase(body)
    );
  }
}
