import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ChangeSchedule,
  ChangeSchedulePayload,
  ChangeScheduleSearch,
  ExamScheduleModel,
  Note,
  PaginationResponseModel,
  ResponseModel,
  SearchSchedule,
  StudyScheduleModel,
} from 'src/shared/models';
import { BaseDataService } from './core/base-data.service';
import { RequestChangeSchedulePayload } from '@shared/models/schedule/request-change-schedule-payload.model';
import { ObjectHelper, ObservableHelper } from '@shared/helpers';
import {
  ChangeScheduleCancelPayload,
  ChangeScheduleResponsePayload,
} from '@shared/models/change-schedule/change-schedule-response-payload.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService extends BaseDataService {
  constructor(private http: HttpClient) {
    super();
  }

  public getSchedule(
    params: SearchSchedule,
    idTeacher: string
  ): Observable<StudyScheduleModel[]> {
    return this.http
      .get<StudyScheduleModel[]>(this.url + `teachers/${idTeacher}/schedules`, {
        params: { ...params },
      })
      .pipe(
        ObservableHelper.mapObjectArrayWithDateProperties(['date']),
        map((res) => res.map((x) => StudyScheduleModel.parse(x)))
      );
  }

  public getDepartmentSchedule(
    department: string,
    params: SearchSchedule
  ): Observable<StudyScheduleModel[]> {
    return this.http
      .get<StudyScheduleModel[]>(
        this.url + `departments/${department}/schedules`,
        {
          params: { ...params },
        }
      )
      .pipe(
        ObservableHelper.mapObjectArrayWithDateProperties(['date']),
        map((res) => res.map((x) => StudyScheduleModel.parse(x)))
      );
  }

  public getExamSchedule(
    params: SearchSchedule
  ): Observable<ExamScheduleModel[]> {
    return this.http
      .get<ExamScheduleModel[]>(this.url + 'teachers/0849/exam-schedules', {
        params: { ...params },
      })
      .pipe(
        ObservableHelper.mapObjectArrayWithDateProperties([
          'timeStart',
          'timeEnd',
        ]),
        map((res) => res.map((x) => ExamScheduleModel.parse(x)))
      );
  }

  public getDepartmentExamSchedule(
    department: string,
    params: SearchSchedule
  ): Observable<ExamScheduleModel[]> {
    return this.http
      .get<ExamScheduleModel[]>(
        this.url + `departments/${department}/exam-schedules`,
        {
          params: { ...params },
        }
      )
      .pipe(
        ObservableHelper.mapObjectArrayWithDateProperties([
          'timeStart',
          'timeEnd',
        ]),
        map((res) => res.map((x) => ExamScheduleModel.parse(x)))
      );
  }

  public updateExamNote(body: Note): Observable<void> {
    return this.http.put<void>(this.url + 'exam-schedules/update', body);
  }

  public updateStudyNote(body: Note): Observable<void> {
    return this.http.patch<void>(this.url + 'schedules/update', body);
  }

  public changeSchedule(body: ChangeSchedulePayload): Observable<void> {
    return this.http.patch<void>(
      this.url + 'schedules/update',
      ObjectHelper.toSnakeCase(body)
    );
  }

  public requestChangeSchedule(
    body: RequestChangeSchedulePayload
  ): Observable<ResponseModel<number>> {
    return this.http.post<ResponseModel<number>>(
      this.url + 'fixed-schedules/create',
      ObjectHelper.toSnakeCase(body)
    );
  }

  public getDepartmentChangeScheduleRequests(
    department: string,
    params: ChangeScheduleSearch
  ): Observable<PaginationResponseModel<ChangeSchedule>> {
    return this.http.get<PaginationResponseModel<ChangeSchedule>>(
      this.url + `departments/${department}/fixed-schedules`,
      {
        params: { ...params },
      }
    );
  }

  public getPersonalChangeScheduleRequests(
    params: ChangeScheduleSearch
  ): Observable<PaginationResponseModel<ChangeSchedule>> {
    return this.http.get<PaginationResponseModel<ChangeSchedule>>(
      this.url + 'teachers/01/fixed-schedules',
      {
        params: { ...params },
      }
    );
  }

  public getManagerChangeScheduleRequests(
    params: ChangeScheduleSearch
  ): Observable<PaginationResponseModel<ChangeSchedule>> {
    return this.http.get<PaginationResponseModel<ChangeSchedule>>(
      this.url + 'fixed-schedules',
      {
        params: { ...params },
      }
    );
  }

  public responseChangeScheduleRequests(
    body: ChangeScheduleResponsePayload
  ): Observable<void> {
    return this.http.put<void>(
      this.url + 'fixed-schedules/update',
      ObjectHelper.toSnakeCase(body)
    );
  }

  public cancelChangeScheduleRequests(
    body: ChangeScheduleCancelPayload
  ): Observable<void> {
    return this.http.put<void>(
      this.url + 'fixed-schedules/update',
      ObjectHelper.toSnakeCase(body)
    );
  }
}
