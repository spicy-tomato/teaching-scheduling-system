import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import * as PageAction from './statistic-change-schedule.page.actions';
import * as ApiAction from './statistic-change-schedule.api.actions';
import * as fromStatisticChangeSchedule from '.';
import { Store } from '@ngrx/store';
import { ChangeSchedule, ChangeScheduleStatistic } from 'src/shared/models';
import { StatisticService } from '@services/statistic.service';
import { TuiDayRange } from '@taiga-ui/cdk';
import { TeacherService } from '@services/teacher.service';
import { UrlHelper } from '@shared/helpers';

@Injectable()
export class StatisticChangeScheduleEffects {
  /** PRIVATE PROPERTIES */
  private readonly teacher$ = this.appShellStore.pipe(
    fromAppShell.selectNotNullTeacher
  );
  private readonly loadTeacherListSubject$ = new Subject<void>();

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

  public loadTeachersList$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PageAction.loadTeacherList),
        tap(() => {
          this.loadTeacherListSubject$.next();
        })
      );
    },
    { dispatch: false }
  );

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly teacherService: TeacherService,
    private readonly statisticService: StatisticService,
    private readonly store: Store<fromStatisticChangeSchedule.StatisticChangeScheduleState>,
    private readonly appShellStore: Store<fromAppShell.AppShellState>
  ) {
    this.handleLoadTeachersList();
  }

  /** PRIVATE METHODS */
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

  private handleLoadTeachersList(): void {
    combineLatest([this.teacher$, this.loadTeacherListSubject$])
      .pipe(
        mergeMap(([teacher]) => {
          return this.teacherService
            .getByDepartment(teacher.department.id)
            .pipe(
              map((r) => r.data),
              tap((teachersList) => {
                this.store.dispatch(
                  ApiAction.loadTeacherListSuccessful({ teachersList })
                );
              }),
              catchError(() =>
                of(this.store.dispatch(ApiAction.loadTeacherListFailure()))
              )
            );
        })
      )
      .subscribe();
  }
}
