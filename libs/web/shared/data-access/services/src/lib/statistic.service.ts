import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TuiDayRange } from '@taiga-ui/cdk';
import { DateHelper } from '@teaching-scheduling-system/core/utils/helpers';
import {
  AppConfig,
  APP_CONFIG,
} from '@teaching-scheduling-system/web/config/data-access';
import {
  ChangeSchedule,
  ResponseModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { Observable } from 'rxjs';

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
    date: string
  ): Observable<ResponseModel<ChangeSchedule[]>> {
    return this.http.get<ResponseModel<ChangeSchedule[]>>(
      this.url + `departments/${departmentId}/fixed-schedules`,
      {
        params: {
          date,
          'status%5Bin%5D': '300,301,302,500,501',
          'old_date[sort]': 'asc',
          'old_shift[sort]': 'asc',
          'old_id_room[sort]': 'asc',
        },
      }
    );
  }

  getPersonal(
    range: TuiDayRange,
    teacherId: string
  ): Observable<ResponseModel<ChangeSchedule[]>> {
    const from = DateHelper.format(range.from);
    const to = DateHelper.format(range.to);

    return this.http.get<ResponseModel<ChangeSchedule[]>>(
      this.url +
        `teachers/${teacherId}/fixed-schedules?date=${from},${to}&old_date[sort]=asc&old_shift[sort]=asc&old_id_room[sort]=asc`
    );
  }
}
