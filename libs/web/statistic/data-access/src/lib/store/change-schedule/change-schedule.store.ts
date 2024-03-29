import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { TuiDayRange } from '@taiga-ui/cdk';
import {
  DateHelper,
  ObservableHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import {
  ChangeSchedule,
  GenericState,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { StatisticService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectDepartment,
  selectNotNullTeacher,
  selectTeachersInDepartment,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  map,
  mergeMap,
  Observable,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

type ChangeScheduleState = GenericState<ChangeSchedule[]>;

@Injectable()
export class StatisticChangeScheduleStore extends ComponentStore<ChangeScheduleState> {
  // PUBLIC PROPERTIES
  readonly data$ = this.select((s) => s.data);
  readonly status$ = this.select((s) => s.status);
  readonly department$ = this.appShellStore
    .select(selectDepartment)
    .pipe(ObservableHelper.filterNullish(), takeUntil(this.destroy$));
  readonly teachersInDepartment$ = this.appShellStore
    .select(selectTeachersInDepartment)
    .pipe(takeUntil(this.destroy$));
  readonly teacher$ = this.appShellStore.pipe(
    selectNotNullTeacher,
    takeUntil(this.destroy$)
  );

  // EFFECTS
  readonly statisticize = this.effect<{ range: TuiDayRange }>((params$) =>
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

  // CONSTRUCTOR
  constructor(
    private readonly statisticService: StatisticService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(<ChangeScheduleState>{});
  }

  // PUBLIC METHODS
  private getStatistic(
    departmentId: string,
    range: TuiDayRange
  ): Observable<ChangeSchedule[]> {
    const date = [
      DateHelper.format(range.from),
      DateHelper.format(range.to),
    ].join();

    return this.statisticService
      .getDepartment(departmentId, date)
      .pipe(map(({ data }) => data));
  }
}
