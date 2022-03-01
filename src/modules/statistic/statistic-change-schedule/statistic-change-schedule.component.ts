import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@modules/core/base/base.component';
import { StatisticService } from '@services/statistic.service';
import { RANGE_SEPARATOR_CHAR, TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { ChangeSchedule, Nullable, Teacher } from '@shared/models';
import { ObservableHelper } from '@shared/helpers';
import { ExportService } from '@services/export.service';
import { FileType } from '@shared/enums';
import { TuiDayRangePeriod } from '@taiga-ui/kit';

@Component({
  templateUrl: './statistic-change-schedule.component.html',
  styleUrls: ['./statistic-change-schedule.component.scss'],
  providers: [
    {
      provide: RANGE_SEPARATOR_CHAR,
      useValue: ',',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticChangeScheduleComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public exporting = false;
  public form!: FormGroup;

  public readonly export$ = new Subject();
  public readonly min = new TuiDay(2021, 10, 1);
  public readonly items = createDayRangePeriods();

  /** PRIVATE PROPERTIES */
  private readonly teacher$: Observable<Nullable<Teacher>>;

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly statisticService: StatisticService,
    private readonly exportService: ExportService,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.assignSubjects([this.export$]);

    this.teacher$ = appShellStore
      .select(fromAppShell.selectTeacher)
      .pipe(takeUntil(this.destroy$));

    this.initForm();
    this.handleExport();
  }

  /** PUBLIC METHODS */
  public handleExport(): void {
    this.export$
      .pipe(
        withLatestFrom(this.teacher$.pipe(ObservableHelper.filterNullish())),
        map(({ 1: teacher }) => teacher),
        tap((teacher) => {
          this.exporting = true;

          const range = this.form.controls['range'].value as TuiDayRange;
          this.getStatistic(teacher.department.id, range)
            .pipe(
              tap((changeSchedules) => {
                const rangeOptions = {
                  sameMonth: range.from.monthSame(range.to),
                  inOneYear:
                    range.from.month === 0 &&
                    range.from.day === 1 &&
                    range.to.month === 11 &&
                    range.to.day === 31,
                };
                const document =
                  this.exportService.exportChangeScheduleStatistic(
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

                this.exporting = false;
                this.cdr.markForCheck();
              })
            )
            .subscribe();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group({
      range: [null, Validators.required],
    });
  }

  private getStatistic(
    departmentId: string,
    range: TuiDayRange
  ): Observable<ChangeSchedule[]> {
    const date = [
      range.from.getFormattedDay('YMD', '-'),
      range.to.getFormattedDay('YMD', '-'),
    ].join();

    return this.statisticService
      .getChangeSchedule(
        {
          status: '2,3',
          oldDate: date,
          newDate: date,
        },
        departmentId
      )
      .pipe(map((response) => response.data));
  }
}

function createDayRangePeriods(): ReadonlyArray<TuiDayRangePeriod> {
  const today = TuiDay.currentLocal();
  const startOfMonth = today.append({ day: 1 - today.day });
  const startOfYear = new TuiDay(today.year, 0, 1);

  return [
    new TuiDayRangePeriod(
      new TuiDayRange(startOfMonth, startOfMonth.append({ month: 1, day: -1 })),
      'Tháng này'
    ),
    new TuiDayRangePeriod(
      new TuiDayRange(
        startOfMonth.append({ month: -1 }),
        startOfMonth.append({ day: -1 })
      ),
      'Tháng trước'
    ),
    new TuiDayRangePeriod(
      new TuiDayRange(startOfYear, startOfYear.append({ year: 1, day: -1 })),
      'Năm nay'
    ),
    new TuiDayRangePeriod(
      new TuiDayRange(
        startOfYear.append({ year: -1 }),
        startOfYear.append({ day: -1 })
      ),
      'Năm trước'
    ),
  ];
}
