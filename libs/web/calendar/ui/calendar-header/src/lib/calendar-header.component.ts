import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ScheduleComponent, View } from '@syncfusion/ej2-angular-schedule';
import { TuiDestroyService, TuiMonth } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiNotificationsService,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { PermissionConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { fadeIn } from '@teaching-scheduling-system/core/ui/animations';
import {
  DateHelper,
  ScheduleHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import {
  calendarChangeMonth,
  calendarChangeSelectingState,
  calendarChangeView,
  calendarFilter,
  calendarNext,
  calendarPrev,
  calendarSelectFilter,
  calendarSelectModules,
  calendarSelectMonth,
  calendarSelectSelectedDate,
  calendarSelectTeachers,
  calendarSelectView,
  CalendarState,
} from '@teaching-scheduling-system/web/calendar/data-access';
import {
  CalendarFilter,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AppShellState,
  selectNameTitle,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  combineLatest,
  delay,
  map,
  Observable,
  Subject,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

@Component({
  selector: 'tss-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn],
  providers: [
    TuiDestroyService,
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        shape: null,
        appearance: TuiAppearance.Flat,
        size: 'xs',
      },
    },
  ],
})
export class CalendarHeaderComponent implements AfterViewInit {
  /** INPUT */
  @Input() public scheduleComponent!: ScheduleComponent;

  /** PUBLIC PROPERTIES */
  public view$: Observable<View>;
  public filter$: Observable<CalendarFilter>;
  public openSelectMonth = false;
  public month$: Observable<TuiMonth>;
  public dateRange$!: Observable<string>;
  public openFilter = false;
  public activeToday$!: Observable<boolean>;
  public teachers$: Observable<SimpleModel[]>;
  public modules$: Observable<string[]>;

  public readonly clickToday$ = new Subject<void>();
  public readonly permissionConstant = PermissionConstant;

  public showDepartmentSchedule = false;
  public filteredTeachers: SimpleModel[] = [];
  public filteredModules: string[] = [];

  /** PRIVATE PROPERTIES */
  private selectedDate$: Observable<Date>;
  private canDisplayNotification = true;
  private readonly closeFilter$ = new Subject<void>();
  private readonly displayNotification$ = new Subject<void>();

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<CalendarState>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private readonly appShellStore: Store<AppShellState>,
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
    this.teachers$ = store
      .select(calendarSelectTeachers)
      .pipe(takeUntil(this.destroy$));
    this.modules$ = store
      .select(calendarSelectModules)
      .pipe(takeUntil(this.destroy$));

    this.triggerFilter();
    this.handleClickToday();
    this.handleDisplayNotification();
  }

  /** LIFECYCLE */
  public ngAfterViewInit(): void {
    this.triggerDateRange();
    this.triggerActiveToday();
  }

  /** PUBLIC METHODS */
  public onPrev(): void {
    this.store.dispatch(
      calendarPrev({
        oldSelectedDate: this.scheduleComponent.selectedDate,
      })
    );
  }

  public onNext(): void {
    this.store.dispatch(
      calendarNext({
        oldSelectedDate: this.scheduleComponent.selectedDate,
      })
    );
  }

  public onSelectMonth(month: TuiMonth): void {
    this.openSelectMonth = false;
    this.store.dispatch(calendarChangeMonth({ month }));
  }

  public onFilterOpenChange(open: boolean): void {
    if (!open) {
      this.closeFilter$.next();
    }
  }

  public onSelectingDepartmentChange(showDepartmentSchedule: boolean): void {
    this.store.dispatch(
      calendarChangeSelectingState({ changes: { showDepartmentSchedule } })
    );
    this.filteredModules = [];
  }

  public onSelectingTeachersChange(teachers: SimpleModel[]): void {
    this.store.dispatch(
      calendarChangeSelectingState({ changes: { teachers } })
    );
    this.filteredModules = [];
  }

  public filter(): void {
    this.store.dispatch(
      calendarFilter({
        filter: {
          showDepartmentSchedule: this.showDepartmentSchedule,
          teachers: this.filteredTeachers,
          modules: this.filteredModules,
        },
      })
    );
    this.openFilter = false;
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

  /** PRIVATE METHODS */
  private triggerFilter(): void {
    combineLatest([this.filter$, this.closeFilter$])
      .pipe(tap(([filter]) => this.resetFilter(filter)))
      .subscribe();
  }

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

  private handleClickToday(): void {
    this.clickToday$
      .pipe(
        withLatestFrom(this.view$, this.filter$),
        tap(({ 1: view, 2: filter }) => {
          const today = new Date();

          if (
            !ScheduleHelper.dayInCurrentView(
              this.scheduleComponent,
              view,
              today
            )
          ) {
            this.scheduleComponent.selectedDate = today;
            this.store.dispatch(
              calendarChangeMonth({
                month: new TuiMonth(today.getFullYear(), today.getMonth()),
              })
            );
          }

          if (this.canDisplayNotification && !filter.showDepartmentSchedule) {
            this.displayNotification$.next();
          }
        })
      )
      .subscribe();
  }

  private handleDisplayNotification(): void {
    this.displayNotification$
      .pipe(
        withLatestFrom(this.appShellStore.select(selectNameTitle)),
        tap(({ 1: nameTitle }) => {
          this.canDisplayNotification = false;
          const schedule = this.scheduleComponent;
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth();
          const date = now.getDate();
          const eventsCount = schedule.getEvents(
            new Date(year, month, date),
            new Date(year, month, date, 23, 59, 59, 999)
          ).length;
          const content =
            eventsCount === 0
              ? `${nameTitle} hãy tận hưởng thời gian nghỉ ngơi!`
              : `Chúc ${nameTitle.toLowerCase()} có ngày làm việc hiệu quả!`;
          const label =
            eventsCount === 0
              ? `${nameTitle} không có sự kiện nào trong hôm nay`
              : `${nameTitle} có ${eventsCount} sự kiện vào hôm nay`;

          this.notificationsService
            .show(content, { label, autoClose: 6000 })
            .subscribe({
              complete: () => (this.canDisplayNotification = true),
            });
        })
      )
      .subscribe();
  }

  private triggerActiveToday(): void {
    this.activeToday$ = combineLatest([this.selectedDate$, this.view$]).pipe(
      delay(0),
      map(({ 1: view }) =>
        ScheduleHelper.dayInCurrentView(this.scheduleComponent, view)
      )
    );
  }

  private resetFilter(filter: CalendarFilter): void {
    this.showDepartmentSchedule = filter.showDepartmentSchedule;
    this.filteredTeachers = filter.teachers;
    this.filteredModules = filter.modules;
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
