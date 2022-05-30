import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BaseComponent } from '@modules/core/base/base.component';
import { CoreConstant } from '@shared/constants';
import { ObservableHelper, UtilsHelper } from '@shared/helpers';
import { Nullable, SimpleModel } from '@shared/models';
import { TuiFileLike } from '@taiga-ui/kit';
import { Observable, of, Subject } from 'rxjs';
import {
  catchError,
  finalize,
  map,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { ImportService } from '@services/import.service';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';

@Component({
  templateUrl: './assign-schedule-import.component.html',
  styleUrls: ['./assign-schedule-import.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignScheduleImportComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public schoolYears$!: Observable<string[]>;
  public showLoader = false;

  public readonly currentTerm$: Observable<string>;
  public readonly department$: Observable<SimpleModel>;
  public readonly termsInYear = CoreConstant.TERMS_IN_YEAR;
  public readonly batchesInTerm = CoreConstant.BATCHES_IN_TERM;
  public readonly rejectedFiles$ = new Subject<Nullable<TuiFileLike>>();
  public readonly import$ = new Subject<void>();

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
    private readonly cdr: ChangeDetectorRef,
    private readonly fb: FormBuilder,
    private readonly importService: ImportService,
    @Inject(TuiNotificationsService)
    private readonly notificationService: TuiNotificationsService,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.currentTerm$ = appShellStore
      .select(fromAppShell.selectSchoolYear)
      .pipe(takeUntil(this.destroy$));
    this.department$ = appShellStore
      .select(fromAppShell.selectDepartment)
      .pipe(ObservableHelper.filterNullish(), takeUntil(this.destroy$));

    this.initForm();
    this.triggerSchoolYearChange();
    this.handleImport();
  }

  /** PUBLIC METHODS */
  public onTermInYearChange(termInYear: number): void {
    const selectedBatchInTerm = this.batchInTermControl?.value as number;
    if (!this.batchesInTerm[termInYear]?.includes(selectedBatchInTerm)) {
      this.batchInTermControl?.setValue(1);
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

  private handleImport(): void {
    this.import$
      .pipe(
        withLatestFrom(this.department$),
        map((x) => x[1]),
        tap((department) => {
          this.showLoader = true;

          const schoolYear = this.form.controls['schoolYear'].value as string;
          const termInYear = this.form.controls['termInYear'].value as string;
          const batchInTerm = this.form.controls['batchInTerm'].value as string;
          const studySession = `${schoolYear}_${termInYear}_${batchInTerm}`;

          this.importService
            .importSchedule(this.file, department.id, studySession)
            .pipe(
              tap(() => this.showSuccessNotification()),
              catchError(() => {
                this.showErrorNotification();
                return of(null);
              }),
              finalize(() => {
                this.showLoader = false;
                this.cdr.markForCheck();
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  private showSuccessNotification(): void {
    this.notificationService.show('Import lịch thành công!').subscribe();
  }

  private showErrorNotification(): void {
    this.notificationService
      .show('Vui lòng thử lại sau', {
        label: 'Import lịch thất bại!',
        status: TuiNotification.Error,
      })
      .subscribe();
  }
}
