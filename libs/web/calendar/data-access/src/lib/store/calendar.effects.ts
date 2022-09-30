import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { View } from '@syncfusion/ej2-angular-schedule';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  ArrayHelper,
  ObservableHelper,
  PermissionHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import {
  SearchSchedule,
  SimpleModel,
  Teacher,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  ExamService,
  ScheduleService,
} from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectDepartment,
  selectNotNullTeacher,
  selectPermission,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  catchError,
  combineLatest,
  filter,
  map,
  mergeMap,
  Observable,
  of,
  OperatorFunction,
  Subject,
  tap,
  withLatestFrom,
} from 'rxjs';
import * as fromSchedule from '.';
import * as ApiAction from './calendar.api.actions';
import * as PageAction from './calendar.page.actions';

@Injectable()
export class CalendarEffects {
  // PRIVATE PROPERTIES
  private ranges$ = this.store.select(fromSchedule.calendarSelectRanges);
  private view$ = this.store.select(fromSchedule.calendarSelectView);

  private readonly permissions$: Observable<number[]>;
  private readonly department$: Observable<Nullable<SimpleModel>>;
  private readonly teacher$: Observable<Teacher>;
  private readonly loadPersonalExamSubject$ = new Subject<Date>();
  private readonly loadPersonalScheduleSubject$ = new Subject<Date>();
  private readonly loadDepartmentExamSubject$ = new Subject<Date>();
  private readonly loadDepartmentScheduleSubject$ = new Subject<Date>();

  // EFFECTS
  loadPersonalSchedule$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PageAction.calendarLoad),
        tap(({ date }) => {
          this.loadPersonalScheduleSubject$.next(date);
          this.loadPersonalExamSubject$.next(date);
        })
      );
    },
    { dispatch: false }
  );

  loadDepartmentSchedule$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PageAction.calendarLoad),
        tap(({ date }) => {
          this.loadDepartmentScheduleSubject$.next(date);
          this.loadDepartmentExamSubject$.next(date);
        })
      );
    },
    { dispatch: false }
  );

  prev$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.calendarPrev),
      withLatestFrom(this.view$),
      map(([{ oldSelectedDate }, view]) =>
        ApiAction.prev({
          date: adjacentView(oldSelectedDate, view, true),
        })
      )
    );
  });

  next$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.calendarNext),
      withLatestFrom(this.view$),
      map(([{ oldSelectedDate }, view]) =>
        ApiAction.next({
          date: adjacentView(oldSelectedDate, view),
        })
      )
    );
  });

  loadPrev$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApiAction.prev),
      map(({ date }) => PageAction.calendarLoad({ date }))
    );
  });

  loadNext$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApiAction.next),
      map(({ date }) => PageAction.calendarLoad({ date }))
    );
  });

  changeMonth$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.calendarChangeMonth),
      map(({ month }) =>
        ApiAction.changeMonth({
          month,
          date: new Date(month.year, month.month, new Date().getDate()),
        })
      )
    );
  });

  loadChangeMonth$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApiAction.changeMonth),
      map(({ date }) => PageAction.calendarLoad({ date }))
    );
  });

  // CONSTRUCTOR
  constructor(
    private readonly actions$: Actions,
    private readonly scheduleService: ScheduleService,
    private readonly examService: ExamService,
    private readonly store: Store<fromSchedule.CalendarState>,
    appShellStore: Store<AppShellState>
  ) {
    this.permissions$ = appShellStore.select(selectPermission);
    this.department$ = appShellStore.select(selectDepartment);
    this.teacher$ = appShellStore.pipe(selectNotNullTeacher);

    this.handleLoadPersonalSchedule();
    this.handleLoadPersonalExam();
    this.handleLoadDepartmentSchedule();
    this.handleLoadDepartmentExam();
  }

  // PRIVATE METHODS
  private handleLoadPersonalSchedule(): void {
    combineLatest([
      this.loadPersonalScheduleSubject$,
      this.teacher$.pipe(map((x) => x.id)),
    ])
      .pipe(
        this.commonPersonalObservable(),
        mergeMap(({ fetch, ranges, teacherId }) => {
          return this.scheduleService.getSchedule(teacherId, fetch).pipe(
            tap((response) => {
              this.store.dispatch(
                ApiAction.loadPersonalStudySuccessful({
                  schedules: response.data,
                  ranges,
                })
              );
            }),
            catchError(() =>
              of(this.store.dispatch(ApiAction.loadPersonalStudyFailure()))
            )
          );
        })
      )
      .subscribe();
  }

  private handleLoadPersonalExam(): void {
    combineLatest([
      this.loadPersonalExamSubject$,
      this.teacher$.pipe(map((x) => x.id)),
    ])
      .pipe(
        this.commonPersonalObservable(),
        mergeMap(({ fetch, ranges, teacherId }) => {
          return this.examService.getExamSchedule(teacherId, fetch.date).pipe(
            tap((response) => {
              this.store.dispatch(
                ApiAction.loadPersonalExamSuccessful({
                  schedules: response.data,
                  ranges,
                })
              );
            }),
            catchError(() =>
              of(this.store.dispatch(ApiAction.loadPersonalExamFailure()))
            )
          );
        })
      )
      .subscribe();
  }

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
            .getDepartmentSchedule(department, fetch.date)
            .pipe(
              tap((response) => {
                this.store.dispatch(
                  ApiAction.loadDepartmentStudySuccessful({
                    schedules: response.data,
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
          return this.examService
            .getDepartmentExamSchedule(department, fetch.date)
            .pipe(
              tap((response) => {
                this.store.dispatch(
                  ApiAction.loadDepartmentExamSuccessful({
                    schedules: response.data,
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

  private commonPersonalObservable(): OperatorFunction<
    [Date, string],
    {
      teacherId: string;
      fetch: SearchSchedule;
      ranges: TuiDayRange[];
    }
  > {
    return (source$) =>
      source$.pipe(
        map(([date, teacherId]) => ({ date, teacherId })),
        calculateRangeO(this.ranges$.pipe(map((x) => x.department)))
      );
  }

  private commonPermissionObservable(): OperatorFunction<
    [Date, SimpleModel, number[]],
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
        map(([date, department]) => ({ date, department: department.id })),
        calculateRangeWithDepartmentO(
          this.ranges$.pipe(map((x) => x.department))
        )
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

  if (start.dayAfter(ArrayHelper.lastItemTruthy(rangeList).to)) {
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
        fetch: new TuiDayRange(start, curr.from.append({ day: 1 })),
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
  { teacherId: string; date: Date },
  { teacherId: string; fetch: SearchSchedule; ranges: TuiDayRange[] }
> {
  return (source$) =>
    source$.pipe(
      withLatestFrom(ranges$),
      map(([{ teacherId: teacherId, date }, oldRanges]) => ({
        teacherId,
        ...calculateFetchRange(date, oldRanges),
      })),
      filter(
        (data: {
          teacherId: string;
          fetch: Nullable<TuiDayRange>;
          ranges: TuiDayRange[];
        }): data is {
          teacherId: string;
          fetch: TuiDayRange;
          ranges: TuiDayRange[];
        } => data.fetch !== null
      ),
      map(({ teacherId, fetch, ranges }) => {
        return {
          teacherId,
          ranges,
          fetch: {
            date: [
              fetch.from.getFormattedDay('YMD', '-'),
              fetch.to.getFormattedDay('YMD', '-'),
            ].join(),
          },
        };
      })
    );
}

function calculateRangeWithDepartmentO(
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
            date: [
              fetch.from.getFormattedDay('YMD', '-'),
              fetch.to.append({ day: 1 }).getFormattedDay('YMD', '-'),
            ].join(),
          },
        };
      })
    );
}
