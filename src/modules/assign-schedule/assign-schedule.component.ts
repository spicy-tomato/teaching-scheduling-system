import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { CoreConstant } from '@constants/core/core.constant';
import { AcademicYear } from '@models/core/academic-year.model';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ArrayHelper } from 'src/shared/helpers/array.helper';
import * as fromAssignSchedule from './state';

@Component({
  selector: 'tss-assign-schedule',
  templateUrl: './assign-schedule.component.html',
  styleUrls: ['./assign-schedule.component.scss'],
})
export class AssignScheduleComponent extends BaseComponent implements OnInit {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public schoolYears$: Observable<string[]>;
  public academicYears$: Observable<AcademicYear>;
  public trainingTypes$: Observable<string[]>;
  public trainingTypeChange$ = new BehaviorSubject<string>('');
  public readonly termsInYear = CoreConstant.TERMS_IN_YEAR;
  public readonly batchesInTerm = CoreConstant.BATCHES_IN_TERM;

  /** GETTERS */
  public get termInYear(): AbstractControl | null {
    return this.form.get('termInYear');
  }

  public get trainingType(): AbstractControl | null {
    return this.form.get('trainingType');
  }

  private get batchInTerm(): AbstractControl | null {
    return this.form.get('batchInTerm');
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<fromAssignSchedule.AssignScheduleState>
  ) {
    super();

    this.schoolYears$ = this.store
      .select(fromAssignSchedule.selectSchoolYear)
      .pipe(takeUntil(this.destroy$));

    this.academicYears$ = this.store
      .select(fromAssignSchedule.selectAcademicYear)
      .pipe(takeUntil(this.destroy$));

    this.trainingTypes$ = this.store
      .select(fromAssignSchedule.selectTrainingType)
      .pipe(takeUntil(this.destroy$));

    this.initForm();
    this.handleTrainingTypeChange();
  }

  /** LIFE CYCLE */
  public ngOnInit(): void {
    this.store.dispatch(fromAssignSchedule.loadSchoolYear());
    this.store.dispatch(fromAssignSchedule.loadAcademicYear());
  }

  /** PUBLIC METHODS */
  public onTermInYearChange(termInYear: number): void {
    const selectedBatchInTerm = this.batchInTerm?.value as number;
    if (!this.batchesInTerm[termInYear]?.includes(selectedBatchInTerm)) {
      this.batchInTerm?.setValue(1);
    }
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    combineLatest([this.schoolYears$, this.academicYears$])
      .pipe(
        withLatestFrom(this.trainingTypes$),
        tap(([[schoolYears, academicYears], trainingTypes]) => {
          this.form = this.fb.group({
            schoolYear: ArrayHelper.lastItem(schoolYears),
            termInYear: 1,
            batchInTerm: 1,
            trainingType: trainingTypes[0],
            academicYear: academicYears[trainingTypes?.[0]]?.[0] ?? [],
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleTrainingTypeChange(): void {
    this.trainingTypeChange$
      .pipe(
        withLatestFrom(this.academicYears$),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tap(([_, academicYears]) => {
          this.form
            .get('academicYear')
            ?.setValue(
              ArrayHelper.lastItem(
                academicYears[this.trainingType?.value as string]
              )
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
