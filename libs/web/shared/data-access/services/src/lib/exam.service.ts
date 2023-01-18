import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ObjectHelper } from '@teaching-scheduling-system/core/utils/helpers';
import {
  AppConfig,
  APP_CONFIG,
} from '@teaching-scheduling-system/web/config/data-access';
import {
  ExamScheduleModel,
  Note,
  ResponseModel,
  UpdateExamModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { map, Observable } from 'rxjs';

const parseExamSchedule = (response: ResponseModel<ExamScheduleModel[]>) => ({
  ...response,
  data: response.data.map((x) => {
    return ExamScheduleModel.parse(
      ObjectHelper.parseDateProperties(x, ['startAt', 'endAt'])
    );
  }),
});

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  // PRIVATE PROPERTIES
  private readonly url: string;

  // CONSTRUCTOR
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    this.url = config.baseUrl;
  }

  getExamSchedule(
    idTeacher: string,
    date: string
  ): Observable<ResponseModel<ExamScheduleModel[]>> {
    return this.http
      .get<ResponseModel<ExamScheduleModel[]>>(
        this.url + `v1/teachers/${idTeacher}/module-classes/exam-schedules`,
        { params: { 'date[between]': date } }
      )
      .pipe(map(parseExamSchedule));
  }

  getDepartmentExamSchedule(
    department: string,
    dateRangeOrSession: string,
    paramType: 'dateRange' | 'session' = 'dateRange'
  ): Observable<ResponseModel<ExamScheduleModel[]>> {
    const params =
      paramType === 'dateRange'
        ? {
            'date[between]': dateRangeOrSession,
            // For assign exam page, we must sort by date
            'start_at[sort]': 'asc',
          }
        : { study_session: dateRangeOrSession };

    return this.http
      .get<ResponseModel<ExamScheduleModel[]>>(
        this.url +
          `v1/departments/${department}/modules/module-classes/exam-schedules`,
        {
          params: params as any
        }
      )
      .pipe(map(parseExamSchedule));
  }

  update(idExamSchedule: number, body: UpdateExamModel): Observable<void> {
    return this.http.patch<void>(
      this.url + `v1/exam-schedules/${idExamSchedule}`,
      ObjectHelper.toSnakeCase(body)
    );
  }

  updateProctor(idExam: number, proctorsId: string[]): Observable<void> {
    return this.http.post<void>(
      this.url + `v1/exam-schedules/${idExam}/proctors`,
      proctorsId
    );
  }

  updateExamNote(
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
