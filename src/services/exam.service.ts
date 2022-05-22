import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ExamScheduleModel,
  Note,
  ResponseModel,
  SearchSchedule as SearchExam,
  UpdateExamModel,
} from 'src/shared/models';
import { BaseDataService } from './core/base-data.service';
import { ObjectHelper, QueryFilterResult } from '@shared/helpers';
import { map } from 'rxjs/operators';
import { DepartmentExamDta } from '@shared/dtas';

const parseExamSchedule = (response: ResponseModel<ExamScheduleModel[]>) => ({
  ...response,
  data: response.data.map((x) => {
    return ExamScheduleModel.parse(
      ObjectHelper.parseDateProperties(x, ['timeStart', 'timeEnd'])
    );
  }),
});

@Injectable({
  providedIn: 'root',
})
export class ExamService extends BaseDataService {
  constructor(private http: HttpClient) {
    super();
  }

  public getExamSchedule(
    idTeacher: string,
    params: QueryFilterResult<SearchExam>
  ): Observable<ResponseModel<ExamScheduleModel[]>> {
    return this.http
      .get<ResponseModel<ExamScheduleModel[]>>(
        this.url + `v1/teachers/${idTeacher}/module-classes/exam-schedules`,
        { params }
      )
      .pipe(map(parseExamSchedule));
  }

  public getDepartmentExamSchedule(
    department: string,
    params: QueryFilterResult<SearchExam>
  ): Observable<ResponseModel<ExamScheduleModel[]>> {
    const parseParams = ObjectHelper.toSnakeCase(
      params
    ) as unknown as DepartmentExamDta;

    return this.http
      .get<ResponseModel<ExamScheduleModel[]>>(
        this.url +
          `v1/departments/${department}/modules/module-classes/exam-schedules`,
        { params: { ...parseParams } }
      )
      .pipe(map(parseExamSchedule));
  }

  public update(
    idExamSchedule: number,
    body: UpdateExamModel
  ): Observable<void> {
    return this.http.patch<void>(
      this.url + `v1/exam-schedules/${idExamSchedule}`,
      ObjectHelper.toSnakeCase(body)
    );
  }

  public updateProctor(idExam: number, proctorsId: string[]): Observable<void> {
    return this.http.post<void>(
      this.url + `v1/exam-schedules/${idExam}/proctors`,
      proctorsId
    );
  }

  public updateExamNote(
    idTeacher: string,
    idExamSchedule: number,
    body: Note
  ): Observable<void> {
    return this.http.patch<void>(
      this.url + `v1/teachers/${idTeacher}/exam-schedules/${idExamSchedule}`,
      body
    );
  }
}
