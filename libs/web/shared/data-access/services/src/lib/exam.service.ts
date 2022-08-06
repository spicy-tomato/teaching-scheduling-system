import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  ObjectHelper,
  QueryFilterResult,
} from '@teaching-scheduling-system/core/utils/helpers';
import {
  AppConfig,
  APP_CONFIG,
} from '@teaching-scheduling-system/web/config/data-access';
import { DepartmentExamDta } from '@teaching-scheduling-system/web/shared/data-access/dta';
import {
  ExamScheduleModel,
  Note,
  ResponseModel,
  SearchSchedule,
  UpdateExamModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { map, Observable } from 'rxjs';

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
    params: QueryFilterResult<SearchSchedule>
  ): Observable<ResponseModel<ExamScheduleModel[]>> {
    return this.http
      .get<ResponseModel<ExamScheduleModel[]>>(
        this.url + `v1/teachers/${idTeacher}/module-classes/exam-schedules`,
        { params: { ...(params as any) } }
      )
      .pipe(map(parseExamSchedule));
  }

  getDepartmentExamSchedule(
    department: string,
    params: QueryFilterResult<SearchSchedule>
  ): Observable<ResponseModel<ExamScheduleModel[]>> {
    const parsedParams = ObjectHelper.toSnakeCase(
      params
    ) as unknown as DepartmentExamDta;

    return this.http
      .get<ResponseModel<ExamScheduleModel[]>>(
        this.url +
          `v1/departments/${department}/modules/module-classes/exam-schedules?start_at[sort]=asc`,
        { params: { ...parsedParams } }
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
