import { Injectable } from '@angular/core';

import { combineLatest, Observable, of } from 'rxjs';
import {
  catchError,
  distinctUntilKeyChanged,
  map,
  mergeMap,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './schedule.page.actions';
import * as ApiAction from './schedule.api.actions';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { ScheduleService } from '@services/schedule.service';
import { Store } from '@ngrx/store';
import { CommonInfoService } from '@services/common-info.service';
import { BaseComponent } from '@modules/core/base/base.component';
import { SearchSchedule } from '@models/schedule/search-schedule.model';

@Injectable()
export class ScheduleEffects extends BaseComponent {
  /** EFFECTS */
  public loadTeachingSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.load),
      mergeMap(({ departmentSchedule }) => {
        const schedule$ = departmentSchedule
          ? combineLatest([this.department$, this.currentTerm$]).pipe(
              switchMap(([department, currentTerm]) =>
                this.scheduleService.getDepartmentSchedule(
                  department ?? '',
                  getScheduleParam(currentTerm)
                )
              ),
              take(1)
            )
          : this.currentTerm$.pipe(
              switchMap((currentTerm) =>
                this.scheduleService.getSchedule(getScheduleParam(currentTerm))
              )
            );

        return schedule$.pipe(
          map((schedules) => {
            return ApiAction.loadStudySuccessful({ schedules });
          }),
          catchError(() => of(ApiAction.loadStudyFailure()))
        );
      })
    );
  });

  public loadExamSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.load),
      mergeMap(({ departmentSchedule }) => {
        const schedule$ = departmentSchedule
          ? combineLatest([this.department$, this.currentTerm$]).pipe(
              switchMap(([department, currentTerm]) =>
                this.scheduleService.getDepartmentExamSchedule(
                  department ?? '',
                  getScheduleParam(currentTerm)
                )
              ),
              take(1)
            )
          : this.currentTerm$.pipe(
              switchMap((currentTerm) =>
                this.scheduleService.getExamSchedule(
                  getScheduleParam(currentTerm)
                )
              )
            );

        return schedule$.pipe(
          map((schedules) => {
            return ApiAction.loadExamSuccessful({ schedules });
          }),
          catchError(() => of(ApiAction.loadExamFailure()))
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

  private department$: Observable<string | undefined>;
  private currentTerm$: Observable<string>;

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly scheduleService: ScheduleService,
    commonInfoService: CommonInfoService,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.department$ = appShellStore.select(fromAppShell.selectTeacher).pipe(
      map((teacher) => {
        return teacher?.idDepartment;
      }),
      takeUntil(this.destroy$)
    );

    this.currentTerm$ = commonInfoService
      .getCurrentTerm()
      .pipe(takeUntil(this.destroy$));
  }
}

function getScheduleParam(term: string): SearchSchedule {
  return {
    term: term.split('-').join('_'),
    ss: term.split('_')[2] === '1' ? '1,2,3' : '1,2,3,5',
  };
}
