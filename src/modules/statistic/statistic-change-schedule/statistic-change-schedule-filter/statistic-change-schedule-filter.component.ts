import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ExportService } from '@services/export.service';
import { ObservableHelper } from '@shared/helpers';
import { RANGE_SEPARATOR_CHAR, TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { map, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import * as fromStatisticChangeSchedule from '../state';
import { BaseComponent } from '@modules/core/base/base.component';
import { InputDateRangeConstant } from '@shared/constants';
import { ChangeSchedule, Teacher } from '@shared/models';
import { Subject, Observable } from 'rxjs';
import { EApiStatus, FileType } from '@shared/enums';

@Component({
  selector: 'tss-statistic-change-schedule-filter',
  templateUrl: './statistic-change-schedule-filter.component.html',
  styleUrls: ['./statistic-change-schedule-filter.component.scss'],
  providers: [
    {
      provide: RANGE_SEPARATOR_CHAR,
      useValue: ',',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticChangeScheduleFilterComponent
  extends BaseComponent
  implements OnInit
{
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;

  public readonly changeSchedules$: Observable<ChangeSchedule[]>;
  public readonly status$: Observable<EApiStatus>;

  public readonly EApiStatus = EApiStatus;
  public readonly items = InputDateRangeConstant.getPeriods();
  public readonly export$ = new Subject();
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
    private readonly store: Store<fromStatisticChangeSchedule.StatisticChangeScheduleState>,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.assignSubjects([this.export$]);

    this.status$ = store
      .select(fromStatisticChangeSchedule.selectStatus)
      .pipe(takeUntil(this.destroy$));
    this.teacher$ = appShellStore.pipe(
      fromAppShell.selectNotNullTeacher,
      takeUntil(this.destroy$)
    );
    this.changeSchedules$ = store
      .select(fromStatisticChangeSchedule.selectChangeSchedules)
      .pipe(takeUntil(this.destroy$));

    this.initForm();
    this.handleStatisticChange();
    this.handleExport();
  }

  /** LIFE CYCLE */
  public ngOnInit(): void {
    this.statisticizeFirstTime();
  }

  /** PUBLIC METHODS */
  public statisticize(): void {
    const range = this.rangeControlValue;
    this.store.dispatch(fromStatisticChangeSchedule.statisticize({ range }));
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
    this.changeSchedules$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  private handleExport(): void {
    this.export$
      .pipe(
        withLatestFrom(this.changeSchedules$, this.teacher$),
        map(({ 1: changeSchedules, 2: teacher }) => ({
          changeSchedules,
          teacher,
        })),
        tap(({ changeSchedules, teacher }) =>
          this.export(
            changeSchedules.filter((schedule) => schedule.status > 0),
            teacher
          )
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
