import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  AgendaService,
  DayService,
  EventRenderedArgs,
  EventSettingsModel,
  MonthService,
  PopupOpenEventArgs,
  ScheduleComponent,
  View,
  WeekService,
} from '@syncfusion/ej2-angular-schedule';

import { loadCldr, setCulture, L10n } from '@syncfusion/ej2-base';
import { default as EJ2_LOCALE } from '@syncfusion/ej2-locale/src/vi.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as gregorian from 'cldr-data/main/vi/ca-gregorian.json';
import * as numbers from 'cldr-data/main/vi/numbers.json';
import * as timeZoneNames from 'cldr-data/main/vi/timeZoneNames.json';
import * as fromSchedule from '../state';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import {
  distinctUntilChanged,
  filter,
  skip,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { TuiDialogService, TuiNotificationsService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { ExamDialogComponent } from './exam-dialog/exam-dialog.component';
import { EjsScheduleModel } from '@models/schedule/ejs-schedule.model';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { TuiMonth } from '@taiga-ui/cdk';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);
L10n.load({ vi: EJ2_LOCALE.vi });
setCulture('vi');

@Component({
  selector: 'tss-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [WeekService, MonthService, DayService, AgendaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TssScheduleComponent
  extends BaseComponent
  implements AfterViewInit, OnDestroy
{
  /** VIEWCHILD */
  @ViewChild('schedule') public scheduleComponent!: ScheduleComponent;

  /** PUBLIC PROPERTIES */
  public dateRangeHeader = '';
  public currentView: View = 'Month';
  public readonly eventSettings$ = new BehaviorSubject<EventSettingsModel>({});

  /** PRIVATE PROPERTIES */
  private nameTitle$!: Observable<string>;
  private canDisplayNotification = true;
  private readonly clickToday$ = new Subject();
  private readonly staticSettings: EventSettingsModel = {
    allowAdding: false,
    allowEditing: true,
    allowDeleting: false,
  };

  /** CONSTRUCTOR */
  constructor(
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private readonly store: Store<fromSchedule.ScheduleState>,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.nameTitle$ = appShellStore
      .select(fromAppShell.selectNameTitle)
      .pipe(takeUntil(this.destroy$));

    this.handleClickToday();
    this.handleLoadSchedule();
  }

  /** LIFE CYCLE */
  public ngAfterViewInit(): void {
    this.handleSelectedDateChanges();
    this.handleChangeView();
  }

  public ngOnDestroy(): void {
    this.clickToday$.complete();
    super.ngOnDestroy();
  }

  public onEventRendered(args: EventRenderedArgs): void {
    switch (args.data.Type) {
      case 'exam':
        args.element.style.backgroundColor = '#ff8c67';
        break;
    }
  }

  public onEventClick(): void {
    const popup = document.querySelector('.e-quick-popup-wrapper');
    if (!popup) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const popupInstance = popup.ej2_instances[0];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    popupInstance.open = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      popupInstance.refreshPosition();
    };
  }

  public onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'Editor') {
      args.cancel = true;
      this.showExamDialog(args.data as EjsScheduleModel);
    }
  }

  public onClickToday(): void {
    const schedule = this.scheduleComponent;
    const currentViewDates = schedule.getCurrentViewDates();
    const first = currentViewDates[0];
    const last = currentViewDates[currentViewDates.length - 1];
    const today = new Date();

    if (
      (this.currentView !== 'Day' && (today < first || today > last)) ||
      (this.currentView === 'Day' &&
        (first.getDate() !== today.getDate() ||
          first.getMonth() !== today.getMonth() ||
          first.getFullYear() !== today.getFullYear()))
    ) {
      schedule.selectedDate = today;
      this.store.dispatch(
        fromSchedule.changeMonth({
          month: new TuiMonth(today.getFullYear(), today.getMonth()),
        })
      );
    }

    this.clickToday$.next();
  }

  /** PRIVATE METHODS */
  private handleLoadSchedule(): void {
    this.store
      .select(fromSchedule.selectSchedule)
      .pipe(
        tap((schedules) => {
          const dataSource = schedules.map((x) => x.toEjsSchedule());
          this.eventSettings$.next({ dataSource, ...this.staticSettings });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleSelectedDateChanges(): void {
    this.store
      .select(fromSchedule.selectSelectedDate)
      .pipe(
        tap((date) => {
          this.scheduleComponent.selectedDate = new Date(date);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleClickToday(): void {
    combineLatest([this.nameTitle$, this.clickToday$])
      .pipe(
        tap(([nameTitle]) => {
          if (this.canDisplayNotification) {
            this.displayNotification(nameTitle);
          }
        })
      )
      .subscribe();
  }

  private handleChangeView(): void {
    this.store
      .select(fromSchedule.selectView)
      .pipe(
        skip(1),
        distinctUntilChanged(),
        filter((view) => !!view),
        tap((view) => {
          this.scheduleComponent.changeView(view);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private displayNotification(nameTitle: string): void {
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
  }

  private showExamDialog(data?: EjsScheduleModel): void {
    this.dialogService
      .open<string | undefined>(
        new PolymorpheusComponent(ExamDialogComponent, this.injector),
        {
          data,
          dismissible: false,
          label: 'Chi tiết lịch thi',
        }
      )
      .pipe(
        tap((note) => {
          if (note !== undefined) {
            const newData = { ...data, Note: note };
            this.scheduleComponent.saveEvent(newData);
          }
        })
      )
      .subscribe();
  }
}
