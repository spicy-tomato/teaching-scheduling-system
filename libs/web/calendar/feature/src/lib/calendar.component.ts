import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AgendaService,
  DayService,
  EventRenderedArgs,
  EventSettingsModel,
  MonthService,
  NavigatingEventArgs,
  PopupOpenEventArgs,
  RenderCellEventArgs,
  ScheduleComponent,
  WeekService,
} from '@syncfusion/ej2-angular-schedule';
import { Predicate, Query } from '@syncfusion/ej2-data';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import {
  ArrayHelper,
  ChangeStatusHelper,
  DateHelper,
  DeviceHelper,
  ObservableHelper,
  ScheduleHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import {
  calendarLoad,
  calendarNext,
  calendarPrev,
  calendarReset,
  calendarSelectFilteredSchedule,
  calendarSelectSelectedDate,
  calendarSelectStatus,
  calendarSelectView,
  CalendarState,
} from '@teaching-scheduling-system/web/calendar/data-access';
import { ExamDialogComponent } from '@teaching-scheduling-system/web/calendar/dialogs/exam-dialog/feature';
import { TeachingDialogComponent } from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/feature';
import {
  EjsScheduleModel,
  FixedScheduleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { NavbarService } from '@teaching-scheduling-system/web/shell/ui/navbar';
import { SidebarService } from '@teaching-scheduling-system/web/shell/ui/sidebar';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  skip,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    WeekService,
    MonthService,
    DayService,
    AgendaService,
  ],
})
export class CalendarComponent implements OnInit, AfterViewInit {
  /** VIEWCHILD */
  @ViewChild('schedule') public scheduleComponent!: ScheduleComponent;
  @ViewChild('rightMenu') public rightMenuTemplate!: TemplateRef<never>;

  /** PUBLIC PROPERTIES */
  public readonly eventSettings$ = new BehaviorSubject<EventSettingsModel>({});

  /** PRIVATE PROPERTIES */
  private readonly staticSettings: EventSettingsModel = {
    allowAdding: false,
    allowEditing: true,
    allowDeleting: false,
  };
  private calendars: Record<string, boolean> = {};

  /** CONSTRUCTOR */
  constructor(
    private readonly destroy$: TuiDestroyService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector,
    private readonly navbarService: NavbarService,
    private readonly sidebarService: SidebarService,
    private readonly store: Store<CalendarState>
  ) {
    this.store.dispatch(calendarReset());
    this.handleLoadSchedule();
    this.handleSidebarAddItem();
    this.handleSidebarCheckboxChange();
  }

  /** LIFECYCLE */
  public ngOnInit(): void {
    this.store.dispatch(calendarLoad({ date: new Date() }));
  }

  public ngAfterViewInit(): void {
    this.handleSelectedDateChanges();
    this.handleChangeView();
    this.handleChangeStatus();
    this.navbarService.addRightMenu(this.rightMenuTemplate);
  }

  /** PUBLIC METHODS */
  public onRenderCell(args: RenderCellEventArgs): void {
    if (args.element.classList.contains('e-work-cells')) {
      if (args.date && DateHelper.sameDay(args.date, new Date())) {
        args.element.classList.add('today');
      }
    }
    // Disable date navigate when click date header in month view
    if (args.elementType === 'monthCells') {
      args.element.children[0].classList.remove('e-navigate');
    }
  }

  public onEventRendered(args: EventRenderedArgs): void {
    switch (args.data['Type']) {
      case 'exam':
        args.element.style.backgroundColor = '#ff0000';
        break;
    }
    if (args.data['Color']) {
      args.element.style.backgroundColor = args.data['Color'] as string;
    }
    if ((args.data['FixedSchedules'] as FixedScheduleModel[])?.length > 0) {
      const lastFixedSchedule = ArrayHelper.lastItem(
        args.data['FixedSchedules']
      ) as FixedScheduleModel;
      if (ChangeStatusHelper.isPending(lastFixedSchedule.status)) {
        args.element.classList.add('requesting-change');
      } else if (
        lastFixedSchedule.newDate !== null ||
        !lastFixedSchedule.intendTime
      ) {
        args.element.classList.add('changed');
      }
    }
  }

  public onCreated(): void {
    const popup = document.querySelector('.e-quick-popup-wrapper');
    if (!popup) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const popupInstance = (popup as any).ej2_instances[0];
    popupInstance.open = () => {
      popupInstance.refreshPosition();
    };
  }

  public onPopupOpen(args: PopupOpenEventArgs): void {
    if (!args.data) return;

    if (args.type === 'Editor') {
      args.cancel = true;
      this.onShowEditorDialog(args.data as EjsScheduleModel);
    }
  }

  public onNavigating(args: NavigatingEventArgs): void {
    if (!DeviceHelper.isTouchDevice()) {
      return;
    }

    if (args.action === 'date') {
      const { currentDate, previousDate } = args;
      if (currentDate && previousDate) {
        if (currentDate < previousDate) {
          this.store.dispatch(
            calendarPrev({
              oldSelectedDate: this.scheduleComponent.selectedDate,
            })
          );
        } else if (currentDate > previousDate) {
          this.store.dispatch(
            calendarNext({
              oldSelectedDate: this.scheduleComponent.selectedDate,
            })
          );
        }
      }
    }
  }

  public onShowEditorDialog(data: EjsScheduleModel): void {
    switch (data.Type) {
      case 'exam':
        this.showExamEditorDialog(data);
        this.onCloseEditorDialog();
        break;
      case 'study':
        this.showStudyEditorDialog(data);
        this.onCloseEditorDialog();
        break;
    }
  }

  public onCloseEditorDialog(): void {
    this.scheduleComponent.closeQuickInfoPopup();
  }

  /** PRIVATE METHODS */
  private handleLoadSchedule(): void {
    this.store
      .select(calendarSelectFilteredSchedule)
      .pipe(
        filter((s) => s.length > 0),
        map((schedules) => schedules.map((x) => x.toEjsSchedule())),
        tap((dataSource) => {
          this.eventSettings$.next({
            dataSource,
            ...this.staticSettings,
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleSidebarAddItem(): void {
    this.sidebarService
      .listen('calendar.create')
      .pipe(
        tap((events) => {
          events.forEach((e) => {
            if (!this.calendars[e]) {
              this.calendars[e] = true;
            }
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleSidebarCheckboxChange(): void {
    this.sidebarService.event$
      .pipe(
        filter(
          (e) => e.name === 'calendar.exam' || e.name === 'calendar.study'
        ),
        tap((e) => {
          // https://ej2.syncfusion.com/angular/documentation/schedule/appointments/#appointment-filtering
          this.calendars[e.name] = e.value as boolean;
          let predicate: Predicate | undefined;

          for (const [key, checked] of Object.entries(this.calendars)) {
            if (checked) {
              //    key         : calendar.study
              // => compareValue: study
              const compareValue = key.substring(9);
              if (predicate) {
                predicate = predicate.or('Type', 'equal', compareValue);
              } else {
                predicate = new Predicate('Type', 'equal', compareValue);
              }
            }
          }

          this.scheduleComponent.eventSettings.query = predicate
            ? new Query().where(predicate)
            : new Query();
        })
      )
      .subscribe();
  }

  private handleSelectedDateChanges(): void {
    this.store
      .select(calendarSelectSelectedDate)
      .pipe(
        tap((date) => {
          this.scheduleComponent.selectedDate = new Date(date);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleChangeView(): void {
    this.store
      .select(calendarSelectView)
      .pipe(
        skip(1),
        distinctUntilChanged(),
        filter((view) => !!view),
        tap((view) => {
          const today = new Date();
          if (
            view !== 'Month' &&
            ScheduleHelper.dayInCurrentView(
              this.scheduleComponent,
              this.scheduleComponent.currentView,
              today
            )
          ) {
            this.scheduleComponent.selectedDate = today;
          } else if (
            view === 'Month' &&
            DateHelper.weekIncludedByTwoMonths(today) &&
            ScheduleHelper.dayInCurrentView(
              this.scheduleComponent,
              this.scheduleComponent.currentView,
              today
            )
          ) {
            today.setDate(today.getDate() + 7);
            this.scheduleComponent.selectedDate = today;
          }
          this.scheduleComponent.changeView(view);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleChangeStatus(): void {
    this.store
      .select(calendarSelectStatus)
      .pipe(
        map((status) => status === 'loading'),
        distinctUntilChanged(),
        tap((isLoading) => {
          if (isLoading) {
            this.scheduleComponent.showSpinner();
          } else {
            this.scheduleComponent.hideSpinner();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private showExamEditorDialog(data: EjsScheduleModel): void {
    this.dialogService
      .open<string | undefined>(
        new PolymorpheusComponent(ExamDialogComponent, this.injector),
        {
          data,
          label: 'Chi tiết lịch thi',
          closeable: false,
          dismissible: false,
        }
      )
      .pipe(
        ObservableHelper.filterUndefined(),
        tap((Note) => {
          const newData: EjsScheduleModel = { ...data, Note };
          this.scheduleComponent.saveEvent(newData);
        })
      )
      .subscribe();
  }

  private showStudyEditorDialog(schedule: EjsScheduleModel): void {
    const schedules = schedule.StartTime
      ? (this.eventSettings$.value.dataSource as EjsScheduleModel[]).filter(
          (s) =>
            s.Type === 'study' &&
            schedule.StartTime &&
            s.StartTime &&
            DateHelper.sameDay(schedule.StartTime, s.StartTime)
        )
      : [schedule];
    const selectedId = schedule.Id;

    this.dialogService
      .open<EjsScheduleModel[] | undefined>(
        new PolymorpheusComponent(TeachingDialogComponent, this.injector),
        {
          data: { schedules, selectedId },
          size: 'l',
          closeable: false,
          dismissible: false,
        }
      )
      .pipe(
        ObservableHelper.filterNullish(),
        tap((schedules) => this.scheduleComponent.saveEvent(schedules))
      )
      .subscribe();
  }
}
