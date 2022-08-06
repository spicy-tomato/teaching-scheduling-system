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
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  AcademicData,
  SimpleMapModel,
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
  TeachingScheduleAssignState,
  teachingScheduleAssign_Filter,
  teachingScheduleAssign_LoadFilter,
  teachingScheduleAssign_SelectDepartments,
  teachingScheduleAssign_SelectFilterStatus,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
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
  expanded = true;
  openImportDialog = false;
  form!: FormGroup;
  schoolYears$!: Observable<string[]>;

  readonly currentTerm$: Observable<string>;
  readonly academicData$: Observable<AcademicData[]>;
  readonly trainingTypes$: Observable<SimpleModel<number>[]>;
  readonly departments$: Observable<SimpleMapModel<string, SimpleModel[]>[]>;
  readonly filterStatus$: Observable<EApiStatus>;

  readonly termsInYear = CoreConstant.TERMS_IN_YEAR;
  readonly batchesInTerm = CoreConstant.BATCHES_IN_TERM;
  readonly filter$ = new Subject<void>();
  readonly trainingTypeChange$ = new Subject<number>();

  /** PRIVATE PROPERTIES */
  private myDepartment$: Observable<Nullable<SimpleModel>>;

  /** GETTERS */
  get termInYear(): FormControl {
    return this.form.controls['termInYear'] as FormControl;
  }

  get trainingType(): FormControl {
    return this.form.controls['trainingType'] as FormControl;
  }

  private get schoolYear(): FormControl {
    return this.form.controls['schoolYear'] as FormControl;
  }

  private get batchInTerm(): FormControl {
    return this.form.controls['batchInTerm'] as FormControl;
  }

  private get academicYear(): FormControl {
    return this.form.controls['academicYear'] as FormControl;
  }

  private get department(): FormControl {
    return this.form.controls['department'] as FormControl;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<TeachingScheduleAssignState>,
    private readonly destroy$: TuiDestroyService,
    appShellStore: Store<AppShellState>
  ) {
    this.departments$ = this.store
      .select(teachingScheduleAssign_SelectDepartments)
      .pipe(takeUntil(this.destroy$));
    this.filterStatus$ = this.store
      .select(teachingScheduleAssign_SelectFilterStatus)
      .pipe(takeUntil(this.destroy$));
    this.myDepartment$ = appShellStore
      .select(selectDepartment)
      .pipe(takeUntil(this.destroy$));
    this.currentTerm$ = appShellStore
      .select(selectSchoolYear)
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
    this.bindDepartment();
  }

  /** LIFECYCLE */
  ngOnInit(): void {
    this.store.dispatch(teachingScheduleAssign_LoadFilter());
    this.myDepartment$
      .pipe(
        ObservableHelper.filterNullish(),
        tap(() => this.filter$.next()),
        take(1)
      )
      .subscribe();
  }

  /** PUBLIC METHODS */
  onTermInYearChange(termInYear: number): void {
    const selectedBatchInTerm = this.batchInTerm.value as number;
    if (!this.batchesInTerm[termInYear].includes(selectedBatchInTerm)) {
      this.batchInTerm.setValue(1);
    }
  }

  onToggle(): void {
    this.expanded = !this.expanded;
  }

  onOpenImportDialog(): void {
    this.openImportDialog = true;
  }

  @tuiPure
  stringifyTrainingType(
    items: SimpleModel<number>[]
  ): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(
      items.map(({ id, name }) => [id, name] as [number, string])
    );

    return ({ $implicit }) => map.get($implicit) || '';
  }

  @tuiPure
  stringifyAcademicYear(
    items: SimpleModel<number>[]
  ): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(
      items.map(({ id, name }) => [id, name] as [number, string])
    );

    return ({ $implicit }) => map.get($implicit) || '';
  }

  @tuiPure
  stringifyDepartment(
    items: SimpleMapModel<string, SimpleModel[]>[]
  ): TuiStringHandler<TuiContextWithImplicit<string>> {
    const departmentList = items.reduce<SimpleModel[]>(
      (acc, curr) => [...acc, ...curr.value],
      []
    );
    const map = new Map(
      departmentList.map(({ id, name }) => [id, name] as [string, string])
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
      department: '',
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
          this.academicYear.setValue(
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
        tap(() => {
          const dep = this.department.value as string;
          const schoolYear = (this.schoolYear.value as string)
            .split('-')
            .join('_');
          const term = this.termInYear.value as string;

          this.store.dispatch(
            teachingScheduleAssign_Filter({
              dep,
              params: {
                study_sessions: `${schoolYear}_${term}_${
                  this.batchInTerm.value as number
                }`,
              },
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private bindCurrentTerm(): void {
    this.currentTerm$
      .pipe(
        tap((currentTerm) => {
          this.schoolYear.setValue(
            currentTerm.substr(0, currentTerm.length - 2)
          );
          this.termInYear.setValue(currentTerm.slice(-1));
        })
      )
      .subscribe();
  }

  private bindTrainingType(): void {
    this.trainingTypes$
      .pipe(
        filter((trainingTypes) => trainingTypes.length > 0),
        tap((trainingTypes) => {
          this.trainingType.setValue(trainingTypes[0].id);
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
          this.academicYear.setValue(
            ArrayHelper.lastItem(
              academicData[trainingTypes[0].id].academicYears
            ) ?? []
          );
        })
      )
      .subscribe();
  }

  private bindDepartment(): void {
    this.myDepartment$
      .pipe(
        ObservableHelper.filterNullish(),
        tap((dep) => {
          this.department.setValue(dep.id);
        })
      )
      .subscribe();
  }
}
