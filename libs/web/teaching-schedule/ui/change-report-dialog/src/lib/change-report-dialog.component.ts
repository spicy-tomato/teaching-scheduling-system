import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiDayRange, TuiDestroyService } from '@taiga-ui/cdk';
import { tuiButtonOptionsProvider, TuiDialogContext } from '@taiga-ui/core';
import { InputDateRangeConstant } from '@teaching-scheduling-system/core/data-access/constants';
import {
  ObservableHelper,
  StringHelper
} from '@teaching-scheduling-system/core/utils/helpers';
import {
  FileType
} from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  ChangeSchedule,
  Teacher
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { ExportService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectNotNullTeacher
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { map, Observable, Subject, takeUntil, tap, withLatestFrom } from 'rxjs';
import { ExportDialogStore } from './store';
@Component({
  templateUrl: './change-report-dialog.component.html',
  styleUrls: ['./change-report-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ExportDialogStore,
    TuiDestroyService,
    tuiButtonOptionsProvider({
      appearance: 'primary',
      size: 'm',
    }),
  ],
})
export class ChangeReportDialogComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public readonly status$ = this.store.status$;
  public readonly confirm$ = new Subject<void>();

  /** GETTERS */
  private get rangeControlValue(): TuiDayRange {
    return this.form.controls['range'].value as TuiDayRange;
  }

  /** PRIVATE PROPERTIES */
  private readonly teacher$: Observable<Teacher>;

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: ExportDialogStore,
    private readonly exportService: ExportService,
    @Inject(POLYMORPHEUS_CONTEXT)
    public readonly context: TuiDialogContext<void, ChangeSchedule>,
    private readonly destroy$: TuiDestroyService,
    appShellStore: Store<AppShellState>
  ) {
    this.teacher$ = appShellStore.pipe(selectNotNullTeacher);

    this.initForm();
    this.handleConfirm();
    this.handleReceiveData();
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group({
      range: [
        InputDateRangeConstant.getPreviousMonthRange(),
        Validators.required,
      ],
    });
  }

  private handleConfirm(): void {
    this.confirm$
      .pipe(
        withLatestFrom(this.teacher$.pipe(map((teacher) => teacher.id))),
        tap(({ 1: teacherId }) => {
          this.store.getPersonalChangeScheduleRequests({
            range: this.rangeControlValue,
            teacherId,
          });
        })
      )
      .subscribe();
  }

  private handleReceiveData(): void {
    this.store.data$
      .pipe(
        ObservableHelper.filterNullish(),
        withLatestFrom(this.teacher$),
        tap(([data, teacher]) => this.export(data, teacher)),
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
    const document = this.exportService.exportPersonalChangeScheduleStatistic(
      changeSchedules,
      teacher,
      range,
      rangeOptions
    );

    const commonName = 'Thay-doi-lich-giang';
    const teacherName = StringHelper.toLatinText(teacher.name)
      .split(' ')
      .join('-');
    const rangeText = rangeOptions.sameMonth
      ? `thang${range.from.month + 1}_${range.from.year}`
      : rangeOptions.inOneYear
      ? range.from.year
      : `${range.from.formattedDayPart}${range.from.formattedMonthPart}${range.from.formattedYear}_${range.to.formattedDayPart}${range.to.formattedMonthPart}${range.to.formattedYear}`;
    const fileName = `${commonName}_${teacherName}_${rangeText}.docx`;

    this.exportService.exportBlob({
      document,
      name: fileName,
      mimeType: FileType.WORD,
    });
  }
}
