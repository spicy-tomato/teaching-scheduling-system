import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ScheduleComponent, View } from '@syncfusion/ej2-angular-schedule';
import { TuiDestroyService, TuiMonth } from '@taiga-ui/cdk';
import { tuiButtonOptionsProvider } from '@taiga-ui/core';
import { fadeIn } from '@teaching-scheduling-system/core/ui/animations';
import {
  DateHelper,
  ScheduleHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import {
  calendarChangeMonth,
  calendarChangeView,
  calendarResetFilter,
  calendarSelectFilter,
  calendarSelectMonth,
  calendarSelectSelectedDate,
  calendarSelectView,
  calendarSelectActiveTeachers,
  CalendarState,
} from '@teaching-scheduling-system/web/calendar/data-access';
import { CalendarFilterComponent } from '@teaching-scheduling-system/web/calendar/ui/calendar-filter';
import {
  CalendarFilter,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { combineLatest, delay, map, Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'tss-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn],
  providers: [
    TuiDestroyService,
    tuiButtonOptionsProvider({
      appearance: 'flat',
      size: 'xs',
    }),
  ],
})
export class CalendarHeaderComponent implements AfterViewInit {
  /** INPUT */
  @Input() public scheduleComponent!: ScheduleComponent;

  /** VIEWCHILD */
  @ViewChild(CalendarFilterComponent, { static: false })
  public filter!: CalendarFilterComponent;

  /** PUBLIC PROPERTIES */
  public openSelectMonth = false;
  public openFilter = false;
  public view$: Observable<View>;
  public filter$: Observable<CalendarFilter>;
  public month$: Observable<TuiMonth>;
  public dateRange$!: Observable<string>;
  public activeToday$!: Observable<boolean>;
  public activeTeachers$!: Observable<SimpleModel[]>;

  /** PRIVATE PROPERTIES */
  private selectedDate$: Observable<Date>;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<CalendarState>,
    private readonly destroy$: TuiDestroyService
  ) {
    this.selectedDate$ = store
      .select(calendarSelectSelectedDate)
      .pipe(takeUntil(this.destroy$));
    this.filter$ = store
      .select(calendarSelectFilter)
      .pipe(takeUntil(this.destroy$));
    this.month$ = store
      .select(calendarSelectMonth)
      .pipe(takeUntil(this.destroy$));
    this.view$ = store
      .select(calendarSelectView)
      .pipe(takeUntil(this.destroy$));
    this.activeTeachers$ = store
      .select(calendarSelectActiveTeachers)
      .pipe(takeUntil(this.destroy$));
  }

  /** LIFECYCLE */
  public ngAfterViewInit(): void {
    this.triggerDateRange();
    this.triggerActiveToday();
  }

  /** PUBLIC METHODS */
  public onSelectMonth(month: TuiMonth): void {
    this.openSelectMonth = false;
    this.store.dispatch(calendarChangeMonth({ month }));
  }

  public onFilterOpenChange(open: boolean): void {
    if (!open) {
      this.store.dispatch(calendarResetFilter());
    }
  }

  public onClickMonth(): void {
    this.store.dispatch(calendarChangeView({ view: 'Month' }));
  }

  public onClickWeek(): void {
    this.store.dispatch(calendarChangeView({ view: 'Week' }));
  }

  public onClickDay(): void {
    this.store.dispatch(calendarChangeView({ view: 'Day' }));
  }

  public onFilter(): void {
    this.openFilter = false;
  }

  /** PRIVATE METHODS */
  private triggerDateRange(): void {
    this.dateRange$ = combineLatest([this.view$, this.selectedDate$]).pipe(
      map(([view]) => view),
      delay(0),
      map((view) => {
        switch (view) {
          case 'Month':
            return this.monthDateRange();
          case 'Week':
            return this.weekDateRange();
          case 'Day':
            return this.dayDateRange();
        }
        return '';
      }),
      takeUntil(this.destroy$)
    );
  }

  private triggerActiveToday(): void {
    this.activeToday$ = combineLatest([this.selectedDate$, this.view$]).pipe(
      delay(0),
      map(({ 1: view }) =>
        ScheduleHelper.dayInCurrentView(this.scheduleComponent, view)
      )
    );
  }

  private monthDateRange(): string {
    const date = this.scheduleComponent.selectedDate;
    return `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
  }

  private weekDateRange(): string {
    const currentViewDates = this.scheduleComponent.getCurrentViewDates();
    const first = currentViewDates[0];
    const last = currentViewDates[6];

    if (first.getMonth() == last.getMonth()) {
      return `${DateHelper.beautifyDay(
        first.getDate()
      )} - ${DateHelper.beautifyDay(last.getDate())}
      Tháng ${first.getMonth() + 1}, ${first.getFullYear()}`;
    } else if (first.getFullYear() == last.getFullYear()) {
      return `${DateHelper.beautifyDay(first.getDate())} Tháng ${
        first.getMonth() + 1
      } -
      ${DateHelper.beautifyDay(last.getDate())} Tháng ${
        last.getMonth() + 1
      }, ${first.getFullYear()}`;
    } else {
      return `${DateHelper.beautifyDay(first.getDate())} Tháng ${
        first.getMonth() + 1
      }, ${first.getFullYear()} -
      ${DateHelper.beautifyDay(last.getDate())} Tháng ${
        last.getMonth() + 1
      }, ${last.getFullYear()}`;
    }
  }

  private dayDateRange(): string {
    const date = this.scheduleComponent.selectedDate;
    return `${date.getDate()} Tháng ${
      date.getMonth() + 1
    }, ${date.getFullYear()}`;
  }
}
