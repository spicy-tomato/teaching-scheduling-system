import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  TuiContextWithImplicit,
  tuiPure,
  TuiStringHandler,
} from '@taiga-ui/cdk';
import { tuiButtonOptionsProvider } from '@taiga-ui/core';
import { CoreConstant } from '@teaching-scheduling-system/core/data-access/constants';
import {
  ArrayHelper,
  ObservableHelper,
  UtilsHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import { SimpleModel } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  filter,
  map,
  Observable,
  Subject,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { AssignFilterStore } from './store';

@Component({
  selector: 'tss-exam-assign-filter',
  templateUrl: './assign-filter.component.html',
  styleUrls: ['./assign-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiButtonOptionsProvider({
      appearance: 'primary',
      size: 's',
    }),
  ],
})
export class AssignFilterComponent implements OnInit {
  // PUBLIC PROPERTIES
  readonly batchesInTerm = CoreConstant.BATCHES_IN_TERM;
  readonly termsInYear = CoreConstant.TERMS_IN_YEAR;
  readonly trainingTypeChange$ = new Subject<number>();

  readonly currentTerm$ = this.store.currentTerm$;
  readonly academicData$ = this.store.academicData$;
  readonly trainingTypes$ = this.store.trainingTypes$;
  readonly filterStatus$ = this.store.filterStatus$;

  disableFilterButton = false;
  form!: FormGroup;
  schoolYears$!: Observable<string[]>;

  // PRIVATE PROPERTIES
  private readonly myDepartment$ = this.store.myDepartment$;

  // GETTERS
  get termInYearControl(): FormControl {
    return this.form.controls['termInYear'] as FormControl;
  }

  get trainingTypeControl(): FormControl {
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

  // CONSTRUCTOR
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: AssignFilterStore
  ) {
    this.initForm();
    this.triggerSchoolYearChange();
    this.handleTrainingTypeChange();

    this.bindCurrentTerm();
    this.bindTrainingType();
    this.bindAcademicYear();
  }

  // LIFECYCLE
  ngOnInit(): void {
    this.myDepartment$
      .pipe(
        ObservableHelper.filterNullish(),
        tap(() => this.filter()),
        take(1)
      )
      .subscribe();
  }

  // PUBLIC METHODS
  @tuiPure
  stringifyTrainingType(
    items: SimpleModel<number>[]
  ): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(
      items.map(({ id, name }) => [id, name] as [number, string])
    );

    return ({ $implicit }) => map.get($implicit) || '';
  }

  onTermInYearChange(termInYear: number): void {
    const selectedBatchInTerm = this.batchInTermControl.value as number;
    if (!this.batchesInTerm[termInYear].includes(selectedBatchInTerm)) {
      this.batchInTermControl.setValue(1);
    }
    this.onControlChange();
  }

  onControlChange(): void {
    this.disableFilterButton = false;
  }

  filter(): void {
    this.disableFilterButton = true;
    this.store.filter({ studySession: this.studySession });
  }

  // PRIVATE METHODS
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
        })
      )
      .subscribe();
  }

  private bindCurrentTerm(): void {
    this.currentTerm$
      .pipe(
        tap((currentTerm) => {
          this.schoolYearControl.setValue(
            currentTerm.substring(0, currentTerm.length - 2)
          );
          this.termInYearControl.setValue(currentTerm.slice(-1));
        })
      )
      .subscribe();
  }

  private bindTrainingType(): void {
    this.trainingTypes$
      .pipe(
        filter(({ length }) => length > 0),
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
