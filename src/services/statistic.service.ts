import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeScheduleStatisticDta } from '@shared/dtas';
import { ObjectHelper } from '@shared/helpers';
import {
  PaginationResponseModel,
  ChangeSchedule,
  ChangeScheduleStatistic,
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
    params: ChangeScheduleStatistic,
    departmentId: string
  ): Observable<PaginationResponseModel<ChangeSchedule[]>> {
    const parseParams: ChangeScheduleStatisticDta = ObjectHelper.toSnakeCase(
      params
    ) as unknown as ChangeScheduleStatisticDta;

    return this.http.get<PaginationResponseModel<ChangeSchedule[]>>(
      this.url + `departments/${departmentId}/fixed-schedules`,
      { params: { ...parseParams } }
    );
  }
}
