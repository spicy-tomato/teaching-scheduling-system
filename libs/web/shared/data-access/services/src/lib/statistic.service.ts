import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TuiDayRange } from '@taiga-ui/cdk';
import { ChangeScheduleStatisticDta } from '@teaching-scheduling-system/web/shared/data-access/dta';
import {
  ChangeScheduleStatistic,
  ResponseModel,
  ChangeSchedule,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  QueryFilterResult,
  ObjectHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import { Observable } from 'rxjs';
import {
  APP_CONFIG,
  AppConfig,
} from '@teaching-scheduling-system/web/config/data-access';

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  // PRIVATE PROPERTIES 
  private readonly url: string;

  // CONSTRUCTOR 
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    this.url = config.baseUrl;
  }

  getDepartment(
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

  getPersonal(
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
