import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import {
  catchError,
  distinctUntilKeyChanged,
  map,
  mergeMap,
  switchMap,
  take,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './schedule.page.actions';
import * as ApiAction from './schedule.api.actions';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { ScheduleService } from '@services/schedule.service';
import { Store } from '@ngrx/store';

@Injectable()
export class ScheduleEffects {
  /** EFFECTS */
  public load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.load),
      mergeMap(({ departmentSchedule }) => {
        const schedule$ = departmentSchedule
          ? this.department$.pipe(
              switchMap((department) =>
                this.scheduleService.getDepartmentExamSchedule(department ?? '')
              ),
              take(1)
            )
          : this.scheduleService.getExamSchedule();

        return schedule$.pipe(
          map((schedules) => {
            return ApiAction.loadSuccessful({ schedules });
          }),
          catchError(() => of(ApiAction.loadFailure()))
        );
      })
    );
  });

  public filter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.filter),
      distinctUntilKeyChanged(
        'filter',
        (x, y) => x.showDepartmentSchedule === y.showDepartmentSchedule
      ),
      mergeMap(({ filter }) => {
        return of(
          PageAction.load({
            departmentSchedule: filter.showDepartmentSchedule,
          })
        );
      })
    );
  });

  private department$!: Observable<string | undefined>;

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly scheduleService: ScheduleService,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    this.department$ = appShellStore.select(fromAppShell.selectTeacher).pipe(
      map((teacher) => {
        return teacher?.idDepartment;
      })
    );
  }
}
