import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeScheduleStatisticDta } from '@shared/dtas';
import { ObjectHelper, QueryFilterResult } from '@shared/helpers';
import {
  ChangeSchedule,
  ChangeScheduleStatistic,
  ResponseModel,
} from '@shared/models';
import { Observable } from 'rxjs';
import { BaseDataService } from './core/base-data.service';

@Injectable({
  providedIn: 'root',
})
export class StatisticService extends BaseDataService {
  constructor(private http: HttpClient) {
    super();
  }

  public getChangeSchedule(
    departmentId: string,
    params: QueryFilterResult<ChangeScheduleStatistic, string>
  ): Observable<ResponseModel<ChangeSchedule[]>> {
    const parseParams = ObjectHelper.toSnakeCase(
      params
    ) as unknown as ChangeScheduleStatisticDta;

    return this.http.get<ResponseModel<ChangeSchedule[]>>(
      this.url + `departments/${departmentId}/fixed-schedules?`,
      { params: { ...parseParams } }
    );
  }
}
