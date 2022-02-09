import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, OperatorFunction, Subject } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import * as PageAction from './schedule.page.actions';
import * as ApiAction from './schedule.api.actions';
import * as fromSchedule from '.';
import { ScheduleService } from '@services/schedule.service';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@modules/core/base/base.component';
import { PermissionConstant } from '@shared/constants';
import { Nullable, SearchSchedule } from 'src/shared/models';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import {
  ArrayHelper,
  ObservableHelper,
  PermissionHelper,
} from '@shared/helpers';
import { View } from '@syncfusion/ej2-angular-schedule';

@Injectable()
export class ScheduleEffects extends BaseComponent {
  /** PRIVATE PROPERTIES */
  private ranges$ = this.store
    .select(fromSchedule.selectRanges)
    .pipe(takeUntil(this.destroy$));
  private view$ = this.store
    .select(fromSchedule.selectView)
    .pipe(takeUntil(this.destroy$));

  private readonly permissions$: Observable<number[]>;
  private readonly department$: Observable<Nullable<string>>;
  private readonly loadDepartmentExamSubject$ = new Subject<Date>();
  private readonly loadDepartmentScheduleSubject$ = new Subject<Date>();

  /** EFFECTS */
  public loadPersonalTeachingSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.load),
      calculateRangeO(this.ranges$.pipe(map((x) => x.personal))),
      mergeMap(({ fetch, ranges }) => {
        return this.scheduleService.getSchedule(fetch).pipe(
          map((schedules) =>
            ApiAction.loadPersonalStudySuccessful({ schedules, ranges })
          ),
          catchError(() => of(ApiAction.loadPersonalStudyFailure()))
        );
      })
    );
  });

  public loadPersonalExamSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.load),
      calculateRangeO(this.ranges$.pipe(map((x) => x.personal))),
      mergeMap(({ fetch, ranges }) => {
        return this.scheduleService.getExamSchedule(fetch).pipe(
          map((schedules) =>
            ApiAction.loadPersonalExamSuccessful({ schedules, ranges })
          ),
          catchError(() => of(ApiAction.loadPersonalExamFailure()))
        );
      })
    );
  });

  public loadDepartmentSchedule$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PageAction.load),
        tap(({ date }) => {
          this.loadDepartmentScheduleSubject$.next(date);
          this.loadDepartmentExamSubject$.next(date);
        })
      );
    },
    { dispatch: false }
  );

  public prev$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.prev),
      withLatestFrom(this.view$),
      map(([{ oldSelectedDate }, view]) =>
        ApiAction.prev({
          date: adjacentView(oldSelectedDate, view, true),
        })
      )
    );
  });

  public next$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.next),
      withLatestFrom(this.view$),
      map(([{ oldSelectedDate }, view]) =>
        ApiAction.next({
          date: adjacentView(oldSelectedDate, view),
        })
      )
    );
  });

  public loadPrev$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApiAction.prev),
      map(({ date }) => PageAction.load({ date }))
    );
  });

  public loadNext$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApiAction.next),
      map(({ date }) => PageAction.load({ date }))
    );
  });

  public changeMonth$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.changeMonth),
      map(({ month }) =>
        ApiAction.changeMonth({
          month,
          date: new Date(month.year, month.month, new Date().getDate()),
        })
      )
    );
  });

  public loadChangeMonth$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApiAction.changeMonth),
      map(({ date }) => PageAction.load({ date }))
    );
  });

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly scheduleService: ScheduleService,
    private readonly store: Store<fromSchedule.ScheduleState>,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.assignSubjects([
      this.loadDepartmentScheduleSubject$,
      this.loadDepartmentExamSubject$,
    ]);

    this.permissions$ = appShellStore
      .select(fromAppShell.selectPermission)
      .pipe(takeUntil(this.destroy$));
    this.department$ = appShellStore
      .select(fromAppShell.selectDepartment)
      .pipe(takeUntil(this.destroy$));

    this.handleLoadDepartmentSchedule();
    this.handleLoadDepartmentExam();
  }

  /** PRIVATE METHODS */
  private handleLoadDepartmentSchedule(): void {
    combineLatest([
      this.loadDepartmentScheduleSubject$,
      this.department$.pipe(ObservableHelper.filterNullish()),
      this.permissions$.pipe(ObservableHelper.filterNullish()),
    ])
      .pipe(
        this.commonPermissionObservable(),
        mergeMap(({ fetch, ranges, department }) => {
          return this.scheduleService
            .getDepartmentSchedule(department, fetch)
            .pipe(
              tap((schedules) => {
                this.store.dispatch(
                  ApiAction.loadDepartmentStudySuccessful({
                    schedules,
                    ranges,
                  })
                );
              }),
              catchError(() =>
                of(this.store.dispatch(ApiAction.loadDepartmentStudyFailure()))
              )
            );
        })
      )
      .subscribe();
  }

  private handleLoadDepartmentExam(): void {
    combineLatest([
      this.loadDepartmentExamSubject$,
      this.department$.pipe(ObservableHelper.filterNullish()),
      this.permissions$.pipe(ObservableHelper.filterNullish()),
    ])
      .pipe(
        this.commonPermissionObservable(),
        mergeMap(({ fetch, ranges, department }) => {
          return this.scheduleService
            .getDepartmentExamSchedule(department, fetch)
            .pipe(
              tap((schedules) => {
                this.store.dispatch(
                  ApiAction.loadDepartmentExamSuccessful({
                    schedules,
                    ranges,
                  })
                );
              }),
              catchError(() =>
                of(this.store.dispatch(ApiAction.loadDepartmentExamFailure()))
              )
            );
        })
      )
      .subscribe();
  }

  private commonPermissionObservable(): OperatorFunction<
    [Date, string, number[]],
    {
      department: string;
      fetch: SearchSchedule;
      ranges: TuiDayRange[];
    }
  > {
    return (source$) =>
      source$.pipe(
        filter(
          ({ 1: department, 2: permissions }) =>
            !!permissions &&
            !!department &&
            PermissionHelper.isDepartmentHead(permissions)
        ),
        map(([date, department]) => ({ date, department })),
        calculateRangeO(this.ranges$.pipe(map((x) => x.department)))
      );
  }
}

function adjacentView(date: Date, view: View, prev = false): Date {
  switch (view) {
    case 'Month':
      date.setMonth(date.getMonth() + (prev ? -1 : 1));
      break;
    case 'Week':
      date.setDate(date.getDate() + (prev ? -7 : 7));
      break;
    case 'Day':
      date.setDate(date.getDate() + (prev ? -1 : 1));
  }

  return date;
}

function calculateRange(date: Date): { first: Date; last: Date } {
  const start = new Date(date);
  const end = new Date(date);
  start.setDate(start.getDate() - 60);
  end.setDate(end.getDate() + 60);
  return { first: start, last: end };
}

function calculateFetchRange(
  date: Date,
  fetchedDateRanges: TuiDayRange[]
): { fetch: Nullable<TuiDayRange>; ranges: TuiDayRange[] } {
  const { first, last } = calculateRange(date);
  const start = TuiDay.fromUtcNativeDate(first);
  const end = TuiDay.fromUtcNativeDate(last);
  const rangeList = fetchedDateRanges.slice();

  // debugger;

  if (rangeList.length === 0) {
    const range = new TuiDayRange(start, end);
    return {
      fetch: range,
      ranges: [range],
    };
  }

  if (end.dayBefore(rangeList[0].from)) {
    const range = new TuiDayRange(start, end);
    rangeList.unshift(range);
    return {
      fetch: range,
      ranges: rangeList,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (start.dayAfter(ArrayHelper.lastItem(rangeList)!.to)) {
    const range = new TuiDayRange(start, end);
    rangeList.push(range);
    return {
      fetch: range,
      ranges: rangeList,
    };
  }

  for (let i = 0; i < rangeList.length; i++) {
    const curr = rangeList[i];
    const leftGreater = start.daySameOrAfter(curr.from);
    const rightSmaller = end.daySameOrBefore(curr.to);

    if (leftGreater && rightSmaller) {
      return {
        fetch: null,
        ranges: rangeList,
      };
    }

    if (!leftGreater) {
      rangeList[i] = new TuiDayRange(start, curr.to);
      return {
        fetch: new TuiDayRange(start, curr.from.append({ day: 1 }, true)),
        ranges: resolveConflictRanges(rangeList),
      };
    }

    if (start.daySameOrBefore(curr.to)) {
      rangeList[i] = new TuiDayRange(curr.from, end);
      return {
        fetch: new TuiDayRange(curr.to.append({ day: 1 }), end),
        ranges: resolveConflictRanges(rangeList),
      };
    }

    if (end.dayBefore(rangeList[i + 1].from)) {
      const range = new TuiDayRange(start, end);
      rangeList.splice(i + 1, 0, range);
      return {
        fetch: range,
        ranges: rangeList,
      };
    }
  }

  return {
    fetch: null,
    ranges: rangeList,
  };
}

function resolveConflictRanges(ranges: TuiDayRange[]): TuiDayRange[] {
  for (let i = 0; i < ranges.length - 1; i++) {
    if (ranges[i].to.daySameOrAfter(ranges[i + 1].from)) {
      ranges[i] = new TuiDayRange(ranges[i].from, ranges[i + 1].to);
      ranges.splice(i + 1, 1);
    }
  }

  return ranges;
}

function calculateRangeO(
  ranges$: Observable<TuiDayRange[]>
): OperatorFunction<
  { department: string; date: Date },
  { department: string; fetch: SearchSchedule; ranges: TuiDayRange[] }
> {
  return (source$) =>
    source$.pipe(
      withLatestFrom(ranges$),
      map(([{ department, date }, oldRanges]) => ({
        department,
        ...calculateFetchRange(date, oldRanges),
      })),
      filter(
        (data: {
          department: string;
          fetch: Nullable<TuiDayRange>;
          ranges: TuiDayRange[];
        }): data is {
          department: string;
          fetch: TuiDayRange;
          ranges: TuiDayRange[];
        } => data.fetch !== null
      ),
      map(({ department, fetch, ranges }) => {
        return {
          department,
          ranges,
          fetch: {
            start: fetch.from.getFormattedDay('YMD', '-'),
            end: fetch.to.append({ day: 1 }).getFormattedDay('YMD', '-'),
          },
        };
      })
    );
}
