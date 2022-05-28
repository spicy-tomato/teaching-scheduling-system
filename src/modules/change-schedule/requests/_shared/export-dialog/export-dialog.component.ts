import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@modules/core/base/base.component';
import { InputDateRangeConstant } from '@shared/constants';
import { EApiStatus, FileType } from '@shared/enums';
import { ObservableHelper, StringHelper } from '@shared/helpers';
import { ChangeSchedule, Teacher } from '@shared/models';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiDialogContext,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ExportDialogStore } from './state';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { ExportService } from '@services/export.service';

@Component({
  selector: 'tss-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ExportDialogStore,
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        shape: null,
        appearance: TuiAppearance.Primary,
        size: 'm',
      },
    },
  ],
})
export class ExportDialogComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public readonly items = InputDateRangeConstant.getPeriods();
  public readonly min = new TuiDay(2021, 10, 1);
  public readonly status$ = this.store.status$;
  public readonly EApiStatus = EApiStatus;
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
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.teacher$ = appShellStore.pipe(fromAppShell.selectNotNullTeacher);

    this.initForm();
    this.handleConfirm();
    this.handleReceiveData();
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group({
      range: [this.items[1].range, Validators.required],
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
