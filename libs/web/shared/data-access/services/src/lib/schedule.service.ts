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
import {
  AcceptChangeScheduleRequestPayload,
  ChangeSchedule,
  ChangeScheduleSearch,
  DenyChangeScheduleRequestPayload,
  IntendTimeChangeScheduleRequestPayload,
  Note,
  PaginationResponseModel,
  RequestChangeSchedulePayload,
  RequestIntendChangeSchedulePayload,
  ResponseModel,
  SearchSchedule,
  SetRoomChangeScheduleRequestPayload,
  StatusModel,
  StudyScheduleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { map, Observable } from 'rxjs';

const parseStudyScheduleModel = (
  response: ResponseModel<StudyScheduleModel[]>
) => ({
  ...response,
  data: response.data.map((x) =>
    StudyScheduleModel.parse(ObjectHelper.parseDateProperties(x, ['date']))
  ),
});

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  /** PRIVATE PROPERTIES */
  private readonly url: string;

  /** CONSTRUCTOR */
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    this.url = config.baseUrl;
  }

  public getSchedule(
    idTeacher: string,
    params: QueryFilterResult<SearchSchedule>
  ): Observable<ResponseModel<StudyScheduleModel[]>> {
    return this.http
      .get<ResponseModel<StudyScheduleModel[]>>(
        this.url + `teachers/${idTeacher}/schedules`,
        { params: { ...(params as any) } }
      )
      .pipe(map(parseStudyScheduleModel));
  }

  public getDepartmentSchedule(
    department: string,
    params: QueryFilterResult<SearchSchedule>
  ): Observable<ResponseModel<StudyScheduleModel[]>> {
    return this.http
      .get<ResponseModel<StudyScheduleModel[]>>(
        this.url +
          `departments/${department}/teachers/module-classes/schedules`,
        { params: { ...(params as any) } }
      )
      .pipe(map(parseStudyScheduleModel));
  }

  public updateStudyNote(idSchedule: number, body: Note): Observable<void> {
    return this.http.patch<void>(
      this.url + `v1/schedules/update/${idSchedule}`,
      body
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

  public requestIntendChangeSchedule(
    body: RequestIntendChangeSchedulePayload
  ): Observable<ResponseModel<number>> {
    return this.http.post<ResponseModel<number>>(
      this.url + 'fixed-schedules/create?type=soft',
      ObjectHelper.toSnakeCase(body)
    );
  }

  public changeSchedule(
    body: RequestChangeSchedulePayload
  ): Observable<ResponseModel<number>> {
    return this.http.post<ResponseModel<number>>(
      this.url + 'fixed-schedules/create?type=hard',
      ObjectHelper.toSnakeCase(body)
    );
  }

  public getDepartmentChangeScheduleRequests(
    department: string,
    params: QueryFilterResult<ChangeScheduleSearch, string, string>
  ): Observable<PaginationResponseModel<ChangeSchedule[]>> {
    return this.http.get<PaginationResponseModel<ChangeSchedule[]>>(
      this.url + `departments/${department}/fixed-schedules`,
      { params: { ...(params as any) } }
    );
  }

  public getPersonalChangeScheduleRequests(
    teacherId: string,
    params: QueryFilterResult<ChangeScheduleSearch, string, string>
  ): Observable<PaginationResponseModel<ChangeSchedule[]>> {
    return this.http.get<PaginationResponseModel<ChangeSchedule[]>>(
      this.url + `teachers/${teacherId}/fixed-schedules`,
      { params: { ...(params as any) } }
    );
  }

  public getManagerChangeScheduleRequests(
    params: QueryFilterResult<ChangeScheduleSearch, string, string>
  ): Observable<PaginationResponseModel<ChangeSchedule[]>> {
    return this.http.get<PaginationResponseModel<ChangeSchedule[]>>(
      this.url + 'fixed-schedules',
      { params: { ...(params as any) } }
    );
  }

  public acceptChangeScheduleRequests(
    id: number,
    body: AcceptChangeScheduleRequestPayload
  ): Observable<ResponseModel<StatusModel>> {
    return this.http.patch<ResponseModel<StatusModel>>(
      this.url + `fixed-schedules/update/${id}?type=accept`,
      ObjectHelper.toSnakeCase(body)
    );
  }

  public setRoomChangeScheduleRequests(
    id: number,
    body: SetRoomChangeScheduleRequestPayload
  ): Observable<void> {
    return this.http.patch<void>(
      this.url + `fixed-schedules/update/${id}?type=set_room`,
      ObjectHelper.toSnakeCase(body)
    );
  }

  public denyChangeScheduleRequests(
    id: number,
    body: DenyChangeScheduleRequestPayload
  ): Observable<ResponseModel<StatusModel>> {
    return this.http.patch<ResponseModel<StatusModel>>(
      this.url + `fixed-schedules/update/${id}?type=deny`,
      ObjectHelper.toSnakeCase(body)
    );
  }

  public cancelChangeScheduleRequests(id: number): Observable<void> {
    return this.http.patch<void>(
      this.url + `fixed-schedules/update/${id}?type=cancel`,
      {}
    );
  }

  public intendTimeChangeScheduleRequests(
    id: number,
    body: IntendTimeChangeScheduleRequestPayload
  ): Observable<void> {
    return this.http.patch<void>(
      this.url + `fixed-schedules/update/${id}?type=intend_time`,
      ObjectHelper.toSnakeCase(body)
    );
  }
}
