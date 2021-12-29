import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnDestroy,
} from '@angular/core';
import { TuiMonth } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiNotificationsService,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@modules/core/base/base.component';
import { delay, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { PermissionConstant } from '@constants/core/permission.constant';
import { ScheduleComponent, View } from '@syncfusion/ej2-angular-schedule';
import { DateHelper } from 'src/shared/helpers/date.helper';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import * as fromSchedule from '@modules/schedule/state';
import { ScheduleFilter } from '@models/schedule/schedule-filter.model';
import { fadeIn } from '@animations/fade.animation';

@Component({
  selector: 'tss-schedule-header',
  templateUrl: './schedule-header.component.html',
  styleUrls: ['./schedule-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn],
  providers: [
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
export class ScheduleHeaderComponent
  extends BaseComponent
  implements AfterViewInit, OnDestroy
{
  /** INPUT */
  @Input() public scheduleComponent!: ScheduleComponent;

  /** PUBLIC PROPERTIES */
  public view$: Observable<View>;
  public filter$: Observable<ScheduleFilter>;
  public openSelectMonth = false;
  public month$: Observable<TuiMonth>;
  public dateRange$!: Observable<string>;
  public openFilter = false;
  public activeToday$!: Observable<boolean>;
  public teachers$: Observable<string[]>;
  public modules$: Observable<string[]>;
  public readonly clickToday$ = new Subject<void>();
  public readonly permissionConstant = PermissionConstant;

  public showDepartmentSchedule = false;
  public filteredTeachers: string[] = [];
  public filteredModules: string[] = [];

  /** PRIVATE PROPERTIES */
  private selectedDate$: Observable<Date>;
  private canDisplayNotification = true;
  private readonly closeFilter$ = new Subject<void>();
  private readonly displayNotification$ = new Subject<void>();

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromSchedule.ScheduleState>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private readonly appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.selectedDate$ = store
      .select(fromSchedule.selectSelectedDate)
      .pipe(takeUntil(this.destroy$));
    this.filter$ = store
      .select(fromSchedule.selectFilter)
      .pipe(takeUntil(this.destroy$));
    this.month$ = store
      .select(fromSchedule.selectMonth)
      .pipe(takeUntil(this.destroy$));
    this.view$ = store
      .select(fromSchedule.selectView)
      .pipe(takeUntil(this.destroy$));
    this.teachers$ = store
      .select(fromSchedule.selectTeachers)
      .pipe(takeUntil(this.destroy$));
    this.modules$ = store
      .select(fromSchedule.selectModules)
      .pipe(takeUntil(this.destroy$));

    this.triggerFilter();
    this.handleClickToday();
    this.handleDisplayNotification();
  }

  /** LIFE CYCLE */
  public ngAfterViewInit(): void {
    this.triggerDateRange();
    this.triggerActiveToday();
  }

  public ngOnDestroy(): void {
    this.clickToday$.complete();
    this.closeFilter$.complete();
    super.ngOnDestroy();
  }

  /** PUBLIC METHODS */
  public onPrev(): void {
    this.store.dispatch(
      fromSchedule.prev({
        oldSelectedDate: this.scheduleComponent.selectedDate,
      })
    );
  }

  public onNext(): void {
    this.store.dispatch(
      fromSchedule.next({
        oldSelectedDate: this.scheduleComponent.selectedDate,
      })
    );
  }

  public onSelectMonth(month: TuiMonth): void {
    this.openSelectMonth = false;
    this.store.dispatch(fromSchedule.changeMonth({ month }));
  }

  public onFilterOpenChange(open: boolean): void {
    if (!open) {
      this.closeFilter$.next();
    }
  }

  public onSelectingDepartmentChange(showDepartmentSchedule: boolean): void {
    this.store.dispatch(
      fromSchedule.changeSelectingState({ changes: { showDepartmentSchedule } })
    );
  }

  public onSelectingTeachersChange(teachers: string[]): void {
    this.store.dispatch(
      fromSchedule.changeSelectingState({ changes: { teachers } })
    );
  }

  public filter(): void {
    this.store.dispatch(
      fromSchedule.filter({
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
    this.store.dispatch(fromSchedule.changeView({ view: 'Month' }));
  }

  public onClickWeek(): void {
    this.store.dispatch(fromSchedule.changeView({ view: 'Week' }));
  }

  public onClickDay(): void {
    this.store.dispatch(fromSchedule.changeView({ view: 'Day' }));
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tap(([_, view, filter]) => {
          const today = new Date();

          if (!this.dayInCurrentView(view, today)) {
            this.scheduleComponent.selectedDate = today;
            this.store.dispatch(
              fromSchedule.changeMonth({
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
        withLatestFrom(this.appShellStore.select(fromAppShell.selectNameTitle)),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tap(([_, nameTitle]) => {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      map(([_, view]) => this.dayInCurrentView(view, new Date()))
    );
  }

  private resetFilter(filter: ScheduleFilter): void {
    this.showDepartmentSchedule = filter.showDepartmentSchedule;
    this.filteredTeachers = filter.teachers;
    this.filteredModules = filter.modules;
  }

  private dayInCurrentView(view: View, date: Date): boolean {
    const schedule = this.scheduleComponent;
    const currentViewDates = schedule.getCurrentViewDates();
    const first = currentViewDates[0];
    const last = currentViewDates[currentViewDates.length - 1];

    return (
      (view !== 'Day' && first <= date && date <= last) ||
      (view === 'Day' &&
        first.getDate() === date.getDate() &&
        first.getMonth() === date.getMonth() &&
        first.getFullYear() === date.getFullYear())
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
