import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { TuiFileLike } from '@taiga-ui/kit';
import { CoreConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { UtilsHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { StatisticImportScheduleStore } from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { map, Observable, Subject, tap } from 'rxjs';

@Component({
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ImportComponent {
  /** PUBLIC PROPERTIES */
  form!: FormGroup;
  schoolYears$!: Observable<string[]>;

  readonly termsInYear = CoreConstant.TERMS_IN_YEAR;
  readonly batchesInTerm = CoreConstant.BATCHES_IN_TERM;
  readonly rejectedFiles$ = new Subject<Nullable<TuiFileLike>>();
  readonly currentTerm$ = this.store.currentTerm$;
  readonly department$ = this.store.department$;
  readonly status$ = this.store.status$;

  /** GETTERS */
  get fileControl(): FormControl {
    return this.form.controls['file'] as FormControl;
  }

  get termInYearControl(): FormControl {
    return this.form.controls['termInYear'] as FormControl;
  }

  private get batchInTermControl(): FormControl {
    return this.form.controls['batchInTerm'] as FormControl;
  }

  get file(): File {
    return this.fileControl.value as File;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    private readonly store: StatisticImportScheduleStore
  ) {
    this.initForm();
    this.triggerSchoolYearChange();
    this.handleStatusChange();
  }

  /** PUBLIC METHODS */
  onTermInYearChange(termInYear: number): void {
    const selectedBatchInTerm = this.batchInTermControl.value as number;
    if (!this.batchesInTerm[termInYear].includes(selectedBatchInTerm)) {
      this.batchInTermControl.setValue(1);
    }
  }

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    if (file instanceof Array) {
      this.rejectedFiles$.next(file[0]);
    } else {
      this.rejectedFiles$.next(file);
    }
  }

  removeFile(): void {
    this.fileControl.setValue(null);
  }

  importFile(): void {
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
          if (status === 'successful') {
            this.showSuccessNotification();
          } else if (status === 'clientError') {
            this.showErrorNotification();
          }
        })
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
