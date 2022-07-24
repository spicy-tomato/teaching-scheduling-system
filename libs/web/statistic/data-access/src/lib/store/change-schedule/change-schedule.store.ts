import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { TuiDayRange } from '@taiga-ui/cdk';
import {
  ObservableHelper,
  UrlHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import {
  ChangeSchedule,
  ChangeScheduleStatistic,
  GenericState,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { StatisticService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectDepartment,
  selectTeachersInDepartment,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { map, mergeMap, Observable, tap, withLatestFrom } from 'rxjs';

type ChangeScheduleState = GenericState<ChangeSchedule[]>;

@Injectable()
export class StatisticChangeScheduleStore extends ComponentStore<ChangeScheduleState> {
  /** PUBLIC PROPERTIES */
  public readonly data$ = this.select((s) => s.data);
  public readonly status$ = this.select((s) => s.status);
  public readonly department$ = this.appShellStore
    .select(selectDepartment)
    .pipe(ObservableHelper.filterNullish());
  public readonly teachersInDepartment$ = this.appShellStore.select(
    selectTeachersInDepartment
  );

  /** EFFECTS */
  public readonly statisticize = this.effect<{ range: TuiDayRange }>(
    (params$) =>
      params$.pipe(
        tap(() => this.patchState({ status: 'loading', error: null })),
        withLatestFrom(this.department$),
        mergeMap(([{ range }, department]) =>
          this.getStatistic(department.id, range).pipe(
            tapResponse(
              (data) =>
                this.patchState({
                  data,
                  status: 'successful',
                  error: '',
                }),
              (error) =>
                this.patchState({
                  status: 'systemError',
                  error: error as string,
                })
            )
          )
        )
      )
  );

  /** CONSTRUCTOR */
  constructor(
    private readonly statisticService: StatisticService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(<ChangeScheduleState>{});
  }

  /** PUBLIC METHODS */
  private getStatistic(
    departmentId: string,
    range: TuiDayRange
  ): Observable<ChangeSchedule[]> {
    const statisticData: ChangeScheduleStatistic = {
      date: [
        range.from.getFormattedDay('YMD', '-'),
        range.to.getFormattedDay('YMD', '-'),
      ].join(),
      status: [300, 301, 302, 500, 501],
    };

    return this.statisticService
      .getDepartment(
        departmentId,
        UrlHelper.queryFilter(
          statisticData,
          {
            status: 'in',
          },
          {
            include: {
              oldDate: {
                sort: 'asc',
              },
              oldShift: {
                sort: 'asc',
              },
              oldIdRoom: {
                sort: 'asc',
              },
            },
          }
        )
      )
      .pipe(map((response) => response.data));
  }
}
