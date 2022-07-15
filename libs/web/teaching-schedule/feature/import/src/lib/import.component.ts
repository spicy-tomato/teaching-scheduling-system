import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { TuiFileLike } from '@taiga-ui/kit';
import { CoreConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  ObservableHelper,
  UtilsHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import { SimpleModel } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AppShellState,
  selectDepartment,
  selectSchoolYear,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { StatisticImportScheduleStore } from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ImportComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public schoolYears$!: Observable<string[]>;

  public readonly currentTerm$: Observable<string>;
  public readonly department$: Observable<SimpleModel>;
  public readonly termsInYear = CoreConstant.TERMS_IN_YEAR;
  public readonly batchesInTerm = CoreConstant.BATCHES_IN_TERM;
  public readonly rejectedFiles$ = new Subject<Nullable<TuiFileLike>>();
  public readonly status$ = this.store.status$;
  public readonly EApiStatus = EApiStatus;

  /** GETTERS */
  public get fileControl(): FormControl {
    return this.form.controls['file'] as FormControl;
  }

  public get termInYearControl(): FormControl {
    return this.form.controls['termInYear'] as FormControl;
  }

  private get batchInTermControl(): FormControl {
    return this.form.controls['batchInTerm'] as FormControl;
  }

  public get file(): File {
    return this.fileControl.value as File;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    private readonly destroy$: TuiDestroyService,
    private readonly store: StatisticImportScheduleStore,
    appShellStore: Store<AppShellState>
  ) {
    this.currentTerm$ = appShellStore
      .select(selectSchoolYear)
      .pipe(takeUntil(this.destroy$));
    this.department$ = appShellStore
      .select(selectDepartment)
      .pipe(ObservableHelper.filterNullish(), takeUntil(this.destroy$));

    this.initForm();
    this.triggerSchoolYearChange();
    this.handleStatusChange();
  }

  /** PUBLIC METHODS */
  public onTermInYearChange(termInYear: number): void {
    const selectedBatchInTerm = this.batchInTermControl.value as number;
    if (!this.batchesInTerm[termInYear].includes(selectedBatchInTerm)) {
      this.batchInTermControl.setValue(1);
    }
  }

  public onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    if (file instanceof Array) {
      this.rejectedFiles$.next(file[0]);
    } else {
      this.rejectedFiles$.next(file);
    }
  }

  public removeFile(): void {
    this.fileControl.setValue(null);
  }

  public importFile(): void {
    const schoolYear = this.form.controls['schoolYear'].value as string;
    const termInYear = this.form.controls['termInYear'].value as string;
    const batchInTerm = this.form.controls['batchInTerm'].value as string;
    const studySession = `${schoolYear}_${termInYear}_${batchInTerm}`;

    this.store.importFile({ file: this.file, studySession });
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group({
      schoolYear: [null, Validators.required],
      termInYear: [null, Validators.required],
      batchInTerm: [1, Validators.required],
      file: [null, Validators.required],
    });
  }

  private triggerSchoolYearChange(): void {
    this.schoolYears$ = this.currentTerm$.pipe(
      map((currentTerm) => UtilsHelper.generateSchoolYears(currentTerm))
    );
  }

  private handleStatusChange(): void {
    this.status$
      .pipe(
        tap((status) => {
          if (status === EApiStatus.successful) {
            this.showSuccessNotification();
          } else if (status === EApiStatus.clientError) {
            this.showErrorNotification();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private showSuccessNotification(): void {
    this.alertService.open('Nhập dữ liệu thành công!').subscribe();
  }

  private showErrorNotification(): void {
    this.alertService
      .open('Vui lòng thử lại sau', {
        label: 'Nhập dữ liệu thất bại!',
        status: TuiNotification.Error,
      })
      .subscribe();
  }
}
