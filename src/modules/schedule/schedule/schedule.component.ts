import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  ViewChild,
} from '@angular/core';
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

import { loadCldr, setCulture, L10n } from '@syncfusion/ej2-base';
import { default as EJS_LOCALE } from '@locales/ejs-locale.json';
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
  map,
  skip,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { ExamEditorDialogComponent } from '../shared/exam-editor-dialog/exam-editor-dialog.component';
import { EApiStatus } from '@shared/enums';
import { StudyEditorDialogComponent } from '../shared/study-editor-dialog/study-editor-dialog.component';
import {
  EjsScheduleModel,
  ChangedScheduleModel,
  FixedScheduleModel,
} from 'src/shared/models';
import {
  ScheduleHelper,
  DateHelper,
  ObservableHelper,
  ArrayHelper,
  ChangeStatusHelper,
} from '@shared/helpers';
import { StudyHistoryDialogComponent } from '../shared/study-editor-dialog/study-editor-content/study-history-dialog/study-history-dialog.component';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);
L10n.load({ vi: EJS_LOCALE.vi });
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
  implements AfterViewInit
{
  /** VIEWCHILD */
  @ViewChild('schedule') public scheduleComponent!: ScheduleComponent;

  /** PUBLIC PROPERTIES */
  public readonly eventSettings$ = new BehaviorSubject<EventSettingsModel>({});
  public readonly peopleMatcher = (item: string): boolean => item !== 'self';

  /** PRIVATE PROPERTIES */
  private readonly staticSettings: EventSettingsModel = {
    allowAdding: false,
    allowEditing: true,
    allowDeleting: false,
  };

  /** CONSTRUCTOR */
  constructor(
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector,
    private readonly store: Store<fromSchedule.ScheduleState>
  ) {
    super();

    this.handleLoadSchedule();
  }

  /** LIFE CYCLE */
  public ngAfterViewInit(): void {
    this.handleSelectedDateChanges();
    this.handleChangeView();
    this.handleChangeStatus();
  }

  /** PUBLIC METHODS */
  public onRenderCell(args: RenderCellEventArgs): void {
    if (args.element.classList.contains('e-work-cells')) {
      if (args.date && DateHelper.sameDay(args.date, new Date())) {
        args.element.classList.add('today');
      }
    }
  }

  public onEventRendered(args: EventRenderedArgs): void {
    switch (args.data.Type) {
      case 'exam':
        args.element.style.backgroundColor = '#ff0000';
        break;
    }
    if (args.data.Color) {
      args.element.style.backgroundColor = args.data.Color as string;
    }
    if ((args.data.FixedSchedules as FixedScheduleModel[])?.length > 0) {
      const lastFixedSchedule = ArrayHelper.lastItem(
        args.data.FixedSchedules
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
    if (!args.data) return;

    if (args.type === 'Editor') {
      args.cancel = true;
      this.showEditorDialog(args.data as EjsScheduleModel);
    }
  }

  public onNavigating(args: NavigatingEventArgs): void {
    if (args.previousView === 'Month' && args.currentView === 'Day') {
      this.store.dispatch(fromSchedule.changeView({ view: 'Day' }));
    }
  }

  public onCloseClick(): void {
    this.scheduleComponent.quickPopup.quickPopupHide();
  }

  public showEditorDialog(data: EjsScheduleModel): void {
    switch (data.Type) {
      case 'exam':
        this.showExamEditorDialog(data);
        break;
      case 'study':
        this.showStudyEditorDialog(data);
        break;
    }
  }

  public onShowHistory(fixedSchedules: FixedScheduleModel[]): void {
    this.dialogService
      .open(
        new PolymorpheusComponent(StudyHistoryDialogComponent, this.injector),
        {
          data: fixedSchedules,
          label: 'Lịch sử thay đổi giờ giảng',
        }
      )
      .subscribe();
  }

  /** PRIVATE METHODS */
  private handleLoadSchedule(): void {
    this.store
      .select(fromSchedule.selectFilteredSchedule)
      .pipe(
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

  private handleChangeView(): void {
    this.store
      .select(fromSchedule.selectView)
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
      .select(fromSchedule.selectStatus)
      .pipe(
        map((status) => status === EApiStatus.loading),
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
        new PolymorpheusComponent(ExamEditorDialogComponent, this.injector),
        {
          data,
          label: 'Chi tiết lịch thi',
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
            schedule.StartTime &&
            s.StartTime &&
            DateHelper.sameDay(schedule.StartTime, s.StartTime)
        )
      : [schedule];
    const selectedId = schedule.Id;

    this.dialogService
      .open<ChangedScheduleModel | undefined>(
        new PolymorpheusComponent(StudyEditorDialogComponent, this.injector),
        {
          data: { schedules, selectedId },
          size: 'l',
        }
      )
      .pipe(
        ObservableHelper.filterNullish(),
        tap((changes) => {
          this.store.dispatch(fromSchedule.changeScheduleInDialog({ changes }));
        })
      )
      .subscribe();
  }
}
