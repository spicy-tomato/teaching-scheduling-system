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
import { BehaviorSubject, combineLatest } from 'rxjs';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { ExamEditorDialogComponent } from './exam-editor-dialog/exam-editor-dialog.component';
import { EjsScheduleModel } from '@models/schedule/ejs-schedule.model';
import { EApiStatus } from 'src/shared/enums/api-status.enum';
import { StudyEditorDialogComponent } from './study-editor-dialog/study-editor-dialog.component';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
    if (args.data.Color) {
      args.element.style.backgroundColor = args.data.Color as string;
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
      this.showEditorDialog(args.data as EjsScheduleModel);
    }
  }

  /** PRIVATE METHODS */
  private handleLoadSchedule(): void {
    combineLatest([
      this.store.select(fromSchedule.selectStudySchedule),
      this.store.select(fromSchedule.selectExamSchedule),
    ])
      .pipe(
        tap((schedules) => {
          const dataSource = schedules.reduce<EjsScheduleModel[]>(
            (acc, curr) => [...acc, ...curr.map((x) => x.toEjsSchedule())],
            []
          );
          console.log(dataSource);
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

  private showEditorDialog(data?: EjsScheduleModel): void {
    switch (data?.Type) {
      case 'exam':
        this.showExamEditorDialog(data);
        break;
      case 'study':
        this.showStudyEditorDialog(data);
        break;
    }
  }

  private showExamEditorDialog(data?: EjsScheduleModel): void {
    this.dialogService
      .open<string | undefined>(
        new PolymorpheusComponent(ExamEditorDialogComponent, this.injector),
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

  private showStudyEditorDialog(data?: EjsScheduleModel): void {
    this.dialogService
      .open<string | undefined>(
        new PolymorpheusComponent(StudyEditorDialogComponent, this.injector),
        {
          data,
          dismissible: false,
          label: 'Chi tiết lịch học',
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
