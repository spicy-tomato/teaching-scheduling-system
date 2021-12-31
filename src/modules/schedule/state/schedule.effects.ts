import { Injectable } from '@angular/core';

import { combineLatest, Observable, of } from 'rxjs';
import {
  catchError,
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
import { PermissionConstant } from '@shared/constants';
import { SearchSchedule } from 'src/shared/models';

@Injectable()
export class ScheduleEffects extends BaseComponent {
  /** EFFECTS */
  public loadPersonalTeachingSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.load),
      mergeMap(() => {
        return this.currentTerm$.pipe(
          switchMap((currentTerm) =>
            this.scheduleService.getSchedule(getScheduleParam(currentTerm))
          ),
          map((schedules) =>
            ApiAction.loadPersonalStudySuccessful({ schedules })
          ),
          catchError(() => of(ApiAction.loadPersonalStudyFailure()))
        );
      })
    );
  });

  public loadPersonalExamSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.load),
      mergeMap(() => {
        return this.currentTerm$.pipe(
          switchMap((currentTerm) =>
            this.scheduleService.getExamSchedule(
              getPrevScheduleParam(currentTerm)
            )
          ),
          map((schedules) =>
            ApiAction.loadPersonalExamSuccessful({ schedules })
          ),
          catchError(() => of(ApiAction.loadPersonalExamFailure()))
        );
      })
    );
  });

  public determineLoadDepartmentSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.load),
      mergeMap(() => {
        return this.permission$.pipe(
          switchMap((permission) => {
            if (
              permission?.includes(
                PermissionConstant.SEE_DEPARTMENT_EXAM_SCHEDULE
              )
            ) {
              return of(PageAction.loadDepartmentSchedule());
            }

            return of(ApiAction.unauthorized());
          })
        );
      })
    );
  });

  public loadDepartmentTeachingSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.loadDepartmentSchedule),
      mergeMap(() => {
        return combineLatest([this.department$, this.currentTerm$]).pipe(
          switchMap(([department, currentTerm]) =>
            this.scheduleService.getDepartmentSchedule(
              department ?? '',
              getScheduleParam(currentTerm)
            )
          ),
          map((schedules) => {
            return ApiAction.loadDepartmentStudySuccessful({ schedules });
          }),
          catchError(() => of(ApiAction.loadDepartmentStudyFailure())),
          take(1)
        );
      })
    );
  });

  public loadDepartmentExamSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.loadDepartmentSchedule),
      mergeMap(() => {
        return combineLatest([this.department$, this.currentTerm$]).pipe(
          switchMap(([department, currentTerm]) =>
            this.scheduleService.getDepartmentExamSchedule(
              department ?? '',
              getPrevScheduleParam(currentTerm)
            )
          ),
          map((schedules) => {
            return ApiAction.loadDepartmentExamSuccessful({ schedules });
          }),
          catchError(() => of(ApiAction.loadDepartmentExamFailure())),
          take(1)
        );
      })
    );
  });

  private department$: Observable<string | undefined>;
  private currentTerm$: Observable<string>;
  private permission$: Observable<number[] | undefined>;

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
    this.permission$ = appShellStore
      .select(fromAppShell.selectPermission)
      .pipe(takeUntil(this.destroy$));
  }
}

function getScheduleParam(term: string): SearchSchedule {
  return {
    term: term.split('-').join('_'),
    ss: term.split('_')[2] === '1' ? '1,2,3' : '1,2,3,5',
  };
}

function getPrevScheduleParam(term: string): SearchSchedule {
  const t = term.split('-');
  if (t[2] === '2') {
    term = [t[0], t[1]].join('_') + '_1';
  } else {
    term = [parseInt(t[0]) - 1, parseInt(t[1])].join('_') + '_1';
  }

  return {
    term,
    ss: term.split('_')[2] === '1' ? '1,2,3' : '1,2,3,5',
  };
}
