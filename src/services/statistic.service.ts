import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeScheduleStatisticDta } from '@shared/dtas';
import { ObjectHelper, QueryFilterResult } from '@shared/helpers';
import {
  ChangeSchedule,
  ChangeScheduleStatistic,
  ResponseModel,
} from '@shared/models';
import { TuiDayRange } from '@taiga-ui/cdk';
import { Observable } from 'rxjs';
import { BaseDataService } from './core/base-data.service';

@Injectable({
  providedIn: 'root',
})
export class StatisticService extends BaseDataService {
  constructor(private http: HttpClient) {
    super();
  }

  public getDepartment(
    departmentId: string,
    params: QueryFilterResult<ChangeScheduleStatistic, string>
  ): Observable<ResponseModel<ChangeSchedule[]>> {
    const parseParams = ObjectHelper.toSnakeCase(
      params
    ) as unknown as ChangeScheduleStatisticDta;

    return this.http.get<ResponseModel<ChangeSchedule[]>>(
      this.url + `departments/${departmentId}/fixed-schedules`,
      { params: { ...parseParams } }
    );
  }

  public getPersonal(
    range: TuiDayRange,
    teacherId: string
  ): Observable<ResponseModel<ChangeSchedule[]>> {
    const from = range.from.getFormattedDay('YMD', '-');
    const to = range.to.getFormattedDay('YMD', '-');

    return this.http.get<ResponseModel<ChangeSchedule[]>>(
      this.url +
        `teachers/${teacherId}/fixed-schedules?date=${from},${to}&old_date[sort]=asc&old_shift[sort]=asc&old_id_room[sort]=asc`
    );
  }
}
