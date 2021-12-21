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
import { ExamDialogComponent } from './exam-dialog/exam-dialog.component';
import { EjsScheduleModel } from '@models/schedule/ejs-schedule.model';
import { EApiStatus } from 'src/shared/enums/api-status.enum';

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
  implements AfterViewInit
{
  /** VIEWCHILD */
  @ViewChild('schedule') public scheduleComponent!: ScheduleComponent;

  /** PUBLIC PROPERTIES */
  public readonly eventSettings$ = new BehaviorSubject<EventSettingsModel>({});

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
