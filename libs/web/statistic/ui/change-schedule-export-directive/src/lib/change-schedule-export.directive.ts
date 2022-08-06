import {
  ChangeDetectorRef,
  Directive,
  HostListener,
  Input,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiDayRange, TuiDestroyService } from '@taiga-ui/cdk';
import { FileType } from '@teaching-scheduling-system/web/shared/data-access/enums';
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
import { map, Observable, Subject, takeUntil, tap, withLatestFrom } from 'rxjs';

@Directive({
  selector: '[tssChangeScheduleExport]',
  providers: [TuiDestroyService],
})
export class ChangeScheduleExportDirective {
  /** INPUT */
  @Input('tssChangeScheduleExport') rangeControl!: AbstractControl;

  /** PUBLIC PROPERTIES */
  readonly export$ = new Subject<void>();

  /** PRIVATE PROPERTIES */
  private readonly teacher$: Observable<Teacher>;
  private readonly data$: Observable<ChangeSchedule[]>;

  /** GETTERS */
  private get rangeControlValue(): TuiDayRange {
    return this.rangeControl.value as TuiDayRange;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly exportService: ExportService,
    private readonly destroy$: TuiDestroyService,
    store: StatisticChangeScheduleStore,
    appShellStore: Store<AppShellState>
  ) {
    this.data$ = store.data$;
    this.teacher$ = appShellStore.pipe(
      selectNotNullTeacher,
      takeUntil(this.destroy$)
    );
    this.handleExport();
  }

  /** HOST LISTENER */
  @HostListener('click') onClick(): void {
    this.export$.next();
  }

  /** PRIVATE METHODS */

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
    const fileName = `${teacher.department?.id}_${commonName}_${rangeText}.docx`;

    this.exportService.exportBlob({
      document,
      name: fileName,
      mimeType: FileType.WORD,
    });

    this.cdr.markForCheck();
  }
}
