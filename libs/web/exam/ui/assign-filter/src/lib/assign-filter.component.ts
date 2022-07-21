import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  TuiContextWithImplicit,
  TuiDestroyService,
  tuiPure,
  TuiStringHandler,
} from '@taiga-ui/cdk';
import { tuiButtonOptionsProvider } from '@taiga-ui/core';
import { CoreConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  ArrayHelper,
  ObservableHelper,
  UtilsHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import { ExamAssignStore } from '@teaching-scheduling-system/web/exam/data-access';
import {
  AcademicData,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AppShellState,
  selectAcademicData,
  selectDepartment,
  selectSchoolYear,
  selectTrainingTypes,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  filter,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

@Component({
  selector: 'tss-assign-filter',
  templateUrl: './assign-filter.component.html',
  styleUrls: ['./assign-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    tuiButtonOptionsProvider({
      appearance: 'primary',
      size: 's',
    }),
  ],
})
export class AssignFilterComponent implements OnInit {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public schoolYears$!: Observable<string[]>;

  public readonly currentTerm$: Observable<string>;
  public readonly academicData$: Observable<AcademicData[]>;
  public readonly trainingTypes$: Observable<SimpleModel<number>[]>;

  public readonly batchesInTerm = CoreConstant.BATCHES_IN_TERM;
  public readonly termsInYear = CoreConstant.TERMS_IN_YEAR;
  public readonly filter$ = new Subject<void>();
  public readonly trainingTypeChange$ = new Subject<number>();
  public readonly filterStatus$ = this.store.status$;

  /** GETTERS */
  public get termInYearControl(): FormControl {
    return this.form.controls['termInYear'] as FormControl;
  }

  public get trainingTypeControl(): FormControl {
    return this.form.controls['trainingType'] as FormControl;
  }

  private get schoolYearControl(): FormControl {
    return this.form.controls['schoolYear'] as FormControl;
  }

  private get batchInTermControl(): FormControl {
    return this.form.controls['batchInTerm'] as FormControl;
  }

  private get academicYearControl(): FormControl {
    return this.form.controls['academicYear'] as FormControl;
  }

  private get studySession(): string {
    return `${this.schoolYearControl.value as string}_${
      this.termInYearControl.value as string
    }_${this.batchInTermControl.value as string}`;
  }

  /** PRIVATE PROPERTIES */
  private myDepartment$: Observable<Nullable<SimpleModel>>;

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: ExamAssignStore,
    private readonly destroy$: TuiDestroyService,
    appShellStore: Store<AppShellState>
  ) {
    this.myDepartment$ = appShellStore
      .select(selectDepartment)
      .pipe(ObservableHelper.filterNullish(), takeUntil(this.destroy$));
    this.currentTerm$ = appShellStore
      .select(selectSchoolYear)
      .pipe(takeUntil(this.destroy$));
    this.myDepartment$ = appShellStore
      .select(selectDepartment)
      .pipe(takeUntil(this.destroy$));
    this.academicData$ = appShellStore
      .select(selectAcademicData)
      .pipe(takeUntil(this.destroy$));
    this.trainingTypes$ = appShellStore
      .select(selectTrainingTypes)
      .pipe(takeUntil(this.destroy$));

    this.initForm();
    this.triggerSchoolYearChange();
    this.handleTrainingTypeChange();
    this.handleFilter();

    this.bindCurrentTerm();
    this.bindTrainingType();
    this.bindAcademicYear();
  }

  /** LIFECYCLE */
  public ngOnInit(): void {
    this.myDepartment$
      .pipe(
        ObservableHelper.filterNullish(),
        tap(() => this.filter$.next()),
        take(1)
      )
      .subscribe();
  }

  /** PUBLIC METHODS */
  public onTermInYearChange(termInYear: number): void {
    const selectedBatchInTerm = this.batchInTermControl.value as number;
    if (!this.batchesInTerm[termInYear].includes(selectedBatchInTerm)) {
      this.batchInTermControl.setValue(1);
    }
  }

  @tuiPure
  public stringifyTrainingType(
    items: SimpleModel<number>[]
  ): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(
      items.map(({ id, name }) => [id, name] as [number, string])
    );

    return ({ $implicit }) => map.get($implicit) || '';
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
        withLatestFrom(this.academicData$),
        tap(([trainingTypeId, academicData]) => {
          this.academicYearControl.setValue(
            ArrayHelper.lastItem(academicData[trainingTypeId].academicYears)
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleFilter(): void {
    this.filter$
      .pipe(
        withLatestFrom(
          this.myDepartment$.pipe(ObservableHelper.filterNullish())
        ),
        ObservableHelper.filterNullish(),
        tap(({ 1: department }) => {
          this.store.getExam({
            departmentId: department.id,
            searchParams: {
              studySession: this.studySession,
            },
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
        filter((trainingTypes) => trainingTypes.length > 0),
        tap((trainingTypes) => {
          this.trainingTypeControl.setValue(trainingTypes[0].id);
        })
      )
      .subscribe();
  }

  private bindAcademicYear(): void {
    this.academicData$
      .pipe(
        withLatestFrom(this.trainingTypes$),
        filter(({ 1: trainingTypes }) => trainingTypes.length > 0),
        tap(([academicData, trainingTypes]) => {
          this.academicYearControl.setValue(
            ArrayHelper.lastItem(
              academicData[trainingTypes[0].id].academicYears
            ) ?? []
          );
        })
      )
      .subscribe();
  }
}
