import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { CoreConstant } from '@shared/constants';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@modules/core/base/base.component';
import { AcademicYear, SearchExam, SimpleModel } from '@shared/models';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ArrayHelper, ObservableHelper, UtilsHelper } from '@shared/helpers';
import { EApiStatus } from '@shared/enums';
import { ExamStore } from '@modules/exam/state';

@Component({
  selector: 'tss-exam-list-filter',
  templateUrl: './exam-list-filter.component.html',
  styleUrls: ['./exam-list-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamListFilterComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public schoolYears$!: Observable<string[]>;

  public readonly currentTerm$: Observable<string>;
  public readonly academicYears$: Observable<AcademicYear[]>;
  public readonly trainingTypes$: Observable<string[]>;
  
  public readonly batchesInTerm = CoreConstant.BATCHES_IN_TERM;
  public readonly termsInYear = CoreConstant.TERMS_IN_YEAR;
  public readonly EApiStatus = EApiStatus;
  public readonly filter$ = new Subject();
  public readonly trainingTypeChange$ = new Subject<string>();
  public readonly filterStatus$ = this.store.status$;

  /** GETTERS */
  public get termInYearControl(): AbstractControl {
    return this.form.controls['termInYear'];
  }

  public get trainingTypeControl(): AbstractControl {
    return this.form.controls['trainingType'];
  }

  private get schoolYearControl(): AbstractControl {
    return this.form.controls['schoolYear'];
  }

  private get batchInTermControl(): AbstractControl {
    return this.form.controls['batchInTerm'];
  }

  private get academicYearControl(): AbstractControl {
    return this.form.controls['academicYear'];
  }

  /** PRIVATE PROPERTIES */
  private myDepartment$: Observable<SimpleModel>;

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: ExamStore,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.assignSubjects([this.filter$, this.trainingTypeChange$]);

    this.myDepartment$ = appShellStore
      .select(fromAppShell.selectDepartment)
      .pipe(ObservableHelper.filterNullish(), takeUntil(this.destroy$));
    this.currentTerm$ = appShellStore
      .select(fromAppShell.selectSchoolYear)
      .pipe(takeUntil(this.destroy$));
    this.academicYears$ = appShellStore
      .select(fromAppShell.selectAcademicYear)
      .pipe(takeUntil(this.destroy$));
    this.trainingTypes$ = appShellStore
      .select(fromAppShell.selectTrainingType)
      .pipe(takeUntil(this.destroy$));

    this.initForm();
    this.triggerSchoolYearChange();
    this.handleTrainingTypeChange();
    this.handleFilter();

    this.bindCurrentTerm();
    this.bindTrainingType();
    this.bindAcademicYear();
  }

  /** PUBLIC METHODS */
  public onTermInYearChange(termInYear: number): void {
    const selectedBatchInTerm = this.batchInTermControl.value as number;
    if (!this.batchesInTerm[termInYear].includes(selectedBatchInTerm)) {
      this.batchInTermControl.setValue(1);
    }
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group({
      schoolYear: '',
      termInYear: '',
      batchInTerm: 1,
      trainingType: 'Chính quy',
      academicYear: '',
    });
  }

  private triggerSchoolYearChange(): void {
    this.schoolYears$ = this.currentTerm$.pipe(
      map((currentTerm) => UtilsHelper.generateSchoolYears(currentTerm))
    );
  }

  private handleTrainingTypeChange(): void {
    this.trainingTypeChange$
      .pipe(
        withLatestFrom(this.academicYears$),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tap(([_, academicYears]) => {
          this.academicYearControl.setValue(
            ArrayHelper.lastItem(
              academicYears[this.trainingTypeControl.value as string]
            )
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleFilter(): void {
    this.filter$
      .pipe(
        withLatestFrom(this.myDepartment$),
        tap(({ 1: department }) => {
          this.store.getExam({
            departmentId: department.id,
            searchParams: this.form.value as SearchExam,
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private bindCurrentTerm(): void {
    this.currentTerm$
      .pipe(
        tap((currentTerm) => {
          this.schoolYearControl.setValue(
            currentTerm.substr(0, currentTerm.length - 2)
          );
          this.termInYearControl.setValue(currentTerm.slice(-1));
        })
      )
      .subscribe();
  }

  private bindTrainingType(): void {
    this.trainingTypes$
      .pipe(
        tap((trainingTypes) => {
          this.trainingTypeControl.setValue(trainingTypes[0]);
        })
      )
      .subscribe();
  }

  private bindAcademicYear(): void {
    this.academicYears$
      .pipe(
        withLatestFrom(this.trainingTypes$),
        tap(([academicYears, trainingTypes]) => {
          this.form
            .get('academicYear')
            ?.setValue(
              ArrayHelper.lastItem(academicYears[trainingTypes?.[0]]) ?? []
            );
        })
      )
      .subscribe();
  }
}
