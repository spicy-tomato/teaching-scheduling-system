import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  ViewChild,
} from '@angular/core';
import {
  ActionEventArgs,
  AgendaService,
  DayService,
  EventRenderedArgs,
  EventSettingsModel,
  MonthService,
  PopupOpenEventArgs,
  ScheduleComponent,
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
import { takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { ExamDialogComponent } from './exam-dialog/exam-dialog.component';
import { EjsScheduleModel } from '@models/schedule/ejs-schedule.model';
import { TuiMonth } from '@taiga-ui/cdk';
import { DateHelper } from 'src/shared/helpers/beautify-time.helper';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);
L10n.load({ vi: EJ2_LOCALE.vi });
setCulture('vi');

type View = 'Month' | 'Week' | 'Day';

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
  public dateRangeHeader = '';
  public currentView: View = 'Month';
  public month!: TuiMonth;

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
    this.handleNavigate();
  }

  /** PUBLIC METHODS */
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
      //   const statusElement: HTMLInputElement = args.element.querySelector(
      //     '#EventType'
      //   ) as HTMLInputElement;
      //   const startElement: HTMLInputElement = args.element.querySelector(
      //     '#StartTime'
      //   ) as HTMLInputElement;
      //   if (!startElement.classList.contains('e-datetimepicker')) {
      //     new DateTimePicker(
      //       { value: new Date(startElement.value) || new Date() },
      //       startElement
      //     );
      //   }
      //   let endElement: HTMLInputElement = args.element.querySelector(
      //     '#EndTime'
      //   ) as HTMLInputElement;
      //   if (!endElement.classList.contains('e-datetimepicker')) {
      //     new DateTimePicker(
      //       { value: new Date(endElement.value) || new Date() },
      //       endElement
      //     );
      //   }
      //   }
    }
  }

  public onActionComplete(event: ActionEventArgs): void {
    switch (event.requestType) {
      case 'dateNavigate':
      case 'viewNavigate':
        this.handleNavigate();
    }
  }

  public onPrev(): void {
    const selectedDate = this.scheduleComponent.selectedDate;
    switch (this.currentView) {
      case 'Month':
        selectedDate.setMonth(selectedDate.getMonth() - 1);
        break;
      case 'Week':
        selectedDate.setDate(selectedDate.getDate() - 7);
        break;
      case 'Day':
        selectedDate.setDate(selectedDate.getDate() - 1);
    }
    this.scheduleComponent.selectedDate = new Date(selectedDate);
  }

  public onNext(): void {
    const selectedDate = this.scheduleComponent.selectedDate;
    switch (this.currentView) {
      case 'Month':
        selectedDate.setMonth(selectedDate.getMonth() + 1);
        break;
      case 'Week':
        selectedDate.setDate(selectedDate.getDate() + 7);
        break;
      case 'Day':
        selectedDate.setDate(selectedDate.getDate() + 1);
    }
    this.scheduleComponent.selectedDate = new Date(selectedDate);
  }

  public onChooseMonth({ month, year }: TuiMonth): void {
    this.scheduleComponent.selectedDate = new Date(
      year,
      month,
      new Date().getDate()
    );
  }

  public onClickToday(): void {
    this.scheduleComponent.selectedDate = new Date();
  }

  public changeView(view: View): void {
    this.scheduleComponent.changeView(view);
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

  private handleNavigate(): void {
    const selectedDate = this.scheduleComponent.selectedDate;
    this.month = new TuiMonth(
      selectedDate.getFullYear(),
      selectedDate.getMonth()
    );

    switch (this.currentView) {
      case 'Month':
        this.handleViewMonth();
        break;
      case 'Week':
        this.handleViewWeek();
        break;
      case 'Day':
        this.handleViewDay();
    }
  }

  private handleViewMonth(): void {
    const date = this.scheduleComponent.selectedDate;
    this.dateRangeHeader = `Tháng ${
      date.getMonth() + 1
    }, ${date.getFullYear()}`;
  }

  private handleViewWeek(): void {
    const currentViewDates = this.scheduleComponent.getCurrentViewDates();
    const first = currentViewDates[0];
    const last = currentViewDates[6];

    if (first.getMonth() == last.getMonth()) {
      this.dateRangeHeader = `${DateHelper.beautifyDay(
        first.getDate()
      )} - ${DateHelper.beautifyDay(last.getDate())}
      Tháng ${first.getMonth() + 1}, ${first.getFullYear()}`;
    } else if (first.getFullYear() == last.getFullYear()) {
      this.dateRangeHeader = `${DateHelper.beautifyDay(
        first.getDate()
      )} Tháng ${first.getMonth() + 1} -
      ${DateHelper.beautifyDay(last.getDate())} Tháng ${
        last.getMonth() + 1
      }, ${first.getFullYear()}`;
    } else {
      this.dateRangeHeader = `${DateHelper.beautifyDay(
        first.getDate()
      )} Tháng ${first.getMonth() + 1}, ${first.getFullYear()} -
      ${DateHelper.beautifyDay(last.getDate())} Tháng ${
        last.getMonth() + 1
      }, ${last.getFullYear()}`;
    }
  }

  private handleViewDay(): void {
    const date = this.scheduleComponent.selectedDate;
    this.dateRangeHeader = `${date.getDate()} Tháng ${
      date.getMonth() + 1
    }, ${date.getFullYear()}`;
  }
}
