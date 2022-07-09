import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  RANGE_SEPARATOR_CHAR,
  TuiDay,
  TuiDayRange,
  TuiDestroyService,
} from '@taiga-ui/cdk';
import { InputDateRangeConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import {
  EApiStatus,
  FileType,
} from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  ChangeSchedule,
  Teacher,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { ExportService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectNotNullTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { StatisticChangeScheduleStore } from '@teaching-scheduling-system/web/statistic/data-access';
import {
  Observable,
  Subject,
  takeUntil,
  tap,
  take,
  withLatestFrom,
  map,
} from 'rxjs';

@Component({
  selector: 'tss-change-schedule-filter',
  templateUrl: './change-schedule-filter.component.html',
  styleUrls: ['./change-schedule-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    {
      provide: RANGE_SEPARATOR_CHAR,
      useValue: ',',
    },
  ],
})
export class ChangeScheduleFilterComponent implements OnInit {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;

  public readonly data$: Observable<ChangeSchedule[]>;
  public readonly status$: Observable<EApiStatus>;

  public readonly EApiStatus = EApiStatus;
  public readonly items = InputDateRangeConstant.getPeriods();
  public readonly export$ = new Subject<void>();
  public readonly min = new TuiDay(2021, 10, 1);

  /** PRIVATE PROPERTIES */
  private readonly teacher$: Observable<Teacher>;

  /** GETTERS */
  private get rangeControlValue(): TuiDayRange {
    return this.form.controls['range'].value as TuiDayRange;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly exportService: ExportService,
    private readonly store: StatisticChangeScheduleStore,
    private readonly destroy$: TuiDestroyService,
    appShellStore: Store<AppShellState>
  ) {
    this.status$ = store.status$;
    this.data$ = store.data$;
    this.teacher$ = appShellStore.pipe(
      selectNotNullTeacher,
      takeUntil(this.destroy$)
    );

    this.initForm();
    this.handleStatisticChange();
    this.handleExport();
  }

  /** LIFECYCLE */
  public ngOnInit(): void {
    this.statisticizeFirstTime();
  }

  /** PUBLIC METHODS */
  public statisticize(): void {
    const range = this.rangeControlValue;
    this.store.statisticize({ range });
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group({
      range: [this.items[1].range, Validators.required],
    });
  }

  private statisticizeFirstTime(): void {
    this.teacher$
      .pipe(
        ObservableHelper.filterNullish(),
        tap(() => this.statisticize()),
        take(1)
      )
      .subscribe();
  }

  private handleStatisticChange(): void {
    this.data$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  private handleExport(): void {
    this.export$
      .pipe(
        withLatestFrom(this.data$, this.teacher$),
        map(({ 1: changeSchedules, 2: teacher }) => ({
          changeSchedules,
          teacher,
        })),
        tap(({ changeSchedules, teacher }) =>
          this.export(changeSchedules, teacher)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private export(changeSchedules: ChangeSchedule[], teacher: Teacher): void {
    const range = this.rangeControlValue;
    const rangeOptions = {
      sameMonth: range.from.monthSame(range.to),
      inOneYear:
        range.from.month === 0 &&
        range.from.day === 1 &&
        range.to.month === 11 &&
        range.to.day === 31,
    };
    const document = this.exportService.exportChangeScheduleStatistic(
      changeSchedules,
      teacher,
      range,
      rangeOptions
    );

    const commonName = 'Thay-doi-lich-giang';
    const rangeText = rangeOptions.sameMonth
      ? `thang${range.from.month + 1}_${range.from.year}`
      : rangeOptions.inOneYear
      ? range.from.year
      : `${range.from.formattedDayPart}${range.from.formattedMonthPart}${range.from.formattedYear}_${range.to.formattedDayPart}${range.to.formattedMonthPart}${range.to.formattedYear}`;
    const fileName = `${teacher.department.id}_${commonName}_${rangeText}.docx`;

    this.exportService.exportBlob({
      document,
      name: fileName,
      mimeType: FileType.WORD,
    });

    this.cdr.markForCheck();
  }
}
