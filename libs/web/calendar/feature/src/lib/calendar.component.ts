import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  OnDestroy,
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
  calendarSelectGoogleCalendarEvents,
  calendarSelectSelectedDate,
  calendarSelectStatus,
  calendarSelectView,
  CalendarState,
} from '@teaching-scheduling-system/web/calendar/data-access';
import { ExamDialogComponent } from '@teaching-scheduling-system/web/calendar/dialogs/exam-dialog/feature';
import { GoogleEventDialogComponent } from '@teaching-scheduling-system/web/calendar/dialogs/google-event-dialog/feature';
import { TeachingDialogComponent } from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/feature';
import {
  EjsScheduleModel,
  FixedScheduleModel,
  GoogleCalendarEvent,
  GoogleCalendarModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  SidebarState,
  sidebar_listen,
  sidebar_reset,
  sidebar_selectEvent,
} from '@teaching-scheduling-system/web/shell/data-access';
import { NavbarService } from '@teaching-scheduling-system/web/shell/ui/navbar';
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
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
  // VIEWCHILD
  @ViewChild('schedule') scheduleComponent!: ScheduleComponent;
  @ViewChild('rightMenu') rightMenuTemplate!: TemplateRef<never>;

  // PUBLIC PROPERTIES
  readonly eventSettings$ = new BehaviorSubject<EventSettingsModel>({});

  // PRIVATE PROPERTIES
  private readonly staticSettings: EventSettingsModel = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: false,
  };
  private calendars: Record<string, boolean> = {};

  // CONSTRUCTOR
  constructor(
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private readonly navbarService: NavbarService,
    private readonly store: Store<CalendarState>,
    private readonly sidebarStore: Store<SidebarState>,
    private readonly destroy$: TuiDestroyService
  ) {
    this.store.dispatch(calendarReset());
    this.handleLoadSchedule();
    this.handleSidebarAddItem();
  }

  // LIFECYCLE
  ngOnInit(): void {
    this.store.dispatch(calendarLoad({ date: new Date() }));
  }

  ngAfterViewInit(): void {
    this.handleSelectedDateChanges();
    this.handleChangeView();
    this.handleChangeStatus();
    this.navbarService.addRightMenu(this.rightMenuTemplate);
  }

  ngOnDestroy(): void {
    this.sidebarStore.dispatch(sidebar_reset());
  }

  // PUBLIC METHODS
  onRenderCell(args: RenderCellEventArgs): void {
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

  onEventRendered(args: EventRenderedArgs): void {
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

  onCreated(): void {
    // const popup = document.querySelector(
    //   '.e-quick-popup-wrapper'
    // ) as EJ2Instance;
    // if (!popup) return;

    // const popupInstance = popup.ej2_instances[0] as Popup;
    // popupInstance.open = () => {
    //   popupInstance.refreshPosition();
    // };

    this.handleSidebarCheckboxChange();
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'Editor') {
      args.cancel = true;
      this.onShowEditorDialog(args.data as EjsScheduleModel);
    }
  }

  onNavigating(args: NavigatingEventArgs): void {
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

  onShowEditorDialog(data: EjsScheduleModel): void {
    switch (data.Type) {
      case 'exam':
        this.showExamEditorDialog(data);
        break;
      case 'study':
        this.showStudyEditorDialog(data);
        break;
      case 'googleEvent':
        this.showGoogleEventEditorDialog(data);
        break;
    }
    this.onCloseEditorDialog();
  }

  onCloseEditorDialog(): void {
    this.scheduleComponent.closeQuickInfoPopup();
  }

  // PRIVATE METHODS
  private handleLoadSchedule(): void {
    this.store
      .select(calendarSelectFilteredSchedule)
      .pipe(
        map((schedules) => schedules.map((x) => x.toEjsSchedule())),
        tap((dataSource) => {
          this.eventSettings$.next({
            ...this.staticSettings,
            // Only update schedule, not Google events
            dataSource: [
              ...(
                (this.eventSettings$.value.dataSource ||
                  []) as EjsScheduleModel[]
              ).filter(({ Type }) => Type === 'googleEvent'),
              ...dataSource,
            ],
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.store
      .select(calendarSelectGoogleCalendarEvents)
      .pipe(
        map((events) =>
          events.map((x) => GoogleCalendarEvent.parse(x).toEjsSchedule())
        ),
        tap((dataSource) => {
          // TODO: Bug
          // console.log(dataSource);
          this.eventSettings$.next({
            ...this.staticSettings,
            // Only update Google events
            dataSource: [
              ...(
                (this.eventSettings$.value.dataSource ||
                  []) as EjsScheduleModel[]
              ).filter(({ Type }) => Type !== 'googleEvent'),
              ...dataSource,
            ],
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleSidebarAddItem(): void {
    this.sidebarStore
      .pipe(
        sidebar_listen('calendar.create'),
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
    this.sidebarStore
      .select(sidebar_selectEvent)
      .pipe(
        ObservableHelper.filterNullish(),
        filter(({ name }) => name !== 'calendar.create'),
        tap(({ name, value }) => {
          // https://ej2.syncfusion.com/angular/documentation/schedule/appointments/#appointment-filtering
          this.calendars[name] = value as boolean;
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
        }),
        takeUntil(this.destroy$)
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
    // Get study schedule in the same day with `schedule`
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

  private showGoogleEventEditorDialog(data: GoogleCalendarModel): void {
    this.dialogService
      .open<Partial<EjsScheduleModel> | undefined>(
        new PolymorpheusComponent(GoogleEventDialogComponent, this.injector),
        {
          data,
          label: 'Chi tiết sự kiện',
          closeable: false,
          dismissible: false,
          size: 'l',
        }
      )
      .pipe(
        ObservableHelper.filterUndefined(),
        tap((newData) => {
          this.scheduleComponent.saveEvent({ ...data, ...newData });
        })
      )
      .subscribe();
  }
}
