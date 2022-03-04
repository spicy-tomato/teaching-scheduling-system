import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import * as PageAction from './statistic-change-schedule.page.actions';
import * as ApiAction from './statistic-change-schedule.api.actions';
import { Store } from '@ngrx/store';
import { ChangeSchedule } from 'src/shared/models';
import { StatisticService } from '@services/statistic.service';
import { TuiDayRange } from '@taiga-ui/cdk';
import { ObservableHelper } from '@shared/helpers';

@Injectable()
export class StatisticChangeScheduleEffects {
  /** PRIVATE PROPERTIES */
  private readonly teacher$ = this.appShellStore
    .select(fromAppShell.selectTeacher)
    .pipe(ObservableHelper.filterNullish());

  /** EFFECTS */
  public statisticize$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.statisticize),
      withLatestFrom(this.teacher$),
      mergeMap(([{ range }, teacher]) => {
        return this.getStatistic(teacher.department.id, range).pipe(
          map((changeSchedules) =>
            ApiAction.statisticizeSuccessful({ changeSchedules })
          ),
          catchError(() => of(ApiAction.statisticizeFailure()))
        );
      })
    );
  });

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly statisticService: StatisticService,
    private readonly appShellStore: Store<fromAppShell.AppShellState>
  ) {}

  /** PRIVATE METHODS */
  private getStatistic(
    departmentId: string,
    range: TuiDayRange
  ): Observable<ChangeSchedule[]> {
    const date = [
      range.from.getFormattedDay('YMD', '-'),
      range.to.getFormattedDay('YMD', '-'),
    ].join();

    return this.statisticService
      .getChangeSchedule(
        {
          status: '-2,-1,2,3',
          oldDate: date,
          newDate: date,
        },
        departmentId
      )
      .pipe(map((response) => response.data));
  }
}
