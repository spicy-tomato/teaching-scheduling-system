import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { CoreConstant } from '@shared/constants';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ArrayHelper, ObservableHelper } from '@shared/helpers';
import * as fromAssignSchedule from '../state';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import {
  tuiPure,
  TuiStringHandler,
  TuiContextWithImplicit,
} from '@taiga-ui/cdk';
import { EApiStatus } from '@shared/enums';
import {
  AcademicYear,
  Nullable,
  SimpleMapModel,
  SimpleModel,
} from 'src/shared/models';

@Component({
  selector: 'tss-assign-schedule-result-filter',
  templateUrl: './assign-schedule-result-filter.component.html',
  styleUrls: ['./assign-schedule-result-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignScheduleResultFilterComponent
  extends BaseComponent
  implements OnInit
{
  /** PUBLIC PROPERTIES */
  public expanded = true;
  public openImportDialog = false;
  public form!: FormGroup;
  public schoolYears$!: Observable<string[]>;

  public readonly currentTerm$: Observable<string>;
  public readonly academicYears$: Observable<AcademicYear>;
  public readonly trainingTypes$: Observable<string[]>;
  public readonly departments$: Observable<
    SimpleMapModel<string, SimpleModel[]>[]
  >;
  public readonly filterStatus$: Observable<EApiStatus>;

  public readonly termsInYear = CoreConstant.TERMS_IN_YEAR;
  public readonly batchesInTerm = CoreConstant.BATCHES_IN_TERM;
  public readonly EApiStatus = EApiStatus;
  public readonly filter$ = new Subject();
  public readonly trainingTypeChange$ = new Subject<string>();

  /** PRIVATE PROPERTIES */
  private myDepartment$: Observable<Nullable<SimpleModel>>;

  /** GETTERS */
  public get termInYear(): Nullable<AbstractControl> {
    return this.form.get('termInYear');
  }

  public get trainingType(): Nullable<AbstractControl> {
    return this.form.get('trainingType');
  }

  private get schoolYear(): Nullable<AbstractControl> {
    return this.form.get('schoolYear');
  }

  private get batchInTerm(): Nullable<AbstractControl> {
    return this.form.get('batchInTerm');
  }

  private get department(): Nullable<AbstractControl> {
    return this.form.get('department');
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<fromAssignSchedule.AssignScheduleState>,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.assignSubjects([this.filter$, this.trainingTypeChange$]);

    this.currentTerm$ = this.store
      .select(fromAssignSchedule.selectSchoolYear)
      .pipe(takeUntil(this.destroy$));
    this.academicYears$ = this.store
      .select(fromAssignSchedule.selectAcademicYear)
      .pipe(takeUntil(this.destroy$));
    this.trainingTypes$ = this.store
      .select(fromAssignSchedule.selectTrainingType)
      .pipe(takeUntil(this.destroy$));
    this.departments$ = this.store
      .select(fromAssignSchedule.selectDepartments)
      .pipe(takeUntil(this.destroy$));
    this.myDepartment$ = appShellStore
      .select(fromAppShell.selectDepartment)
      .pipe(takeUntil(this.destroy$));
    this.filterStatus$ = store
      .select(fromAssignSchedule.selectFilterStatus)
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

  /** LIFE CYCLE */
  public ngOnInit(): void {
    this.store.dispatch(fromAssignSchedule.loadFilter());
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
    const selectedBatchInTerm = this.batchInTerm?.value as number;
    if (!this.batchesInTerm[termInYear]?.includes(selectedBatchInTerm)) {
      this.batchInTerm?.setValue(1);
    }
  }

  public onToggle(): void {
    this.expanded = !this.expanded;
  }

  public onOpenImportDialog(): void {
    this.openImportDialog = true;
  }

  @tuiPure
  public stringifyDepartment(
    items: SimpleMapModel<string, SimpleModel[]>[]
  ): TuiStringHandler<TuiContextWithImplicit<string>> {
    const departmentList = items.reduce<SimpleModel[]>(
      (acc, curr) => [...acc, ...curr.value],
      []
    );
    const map = new Map(
      departmentList.map(({ id, name }) => [id, name] as [string, string])
    );

    return ({ $implicit }: TuiContextWithImplicit<string>) =>
      map.get($implicit) || '';
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
      map((currentTerm) => this.generateSchoolYears(currentTerm))
    );
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

  private handleFilter(): void {
    this.filter$
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tap(() => {
          const dep = this.department?.value as string;
          const schoolYear = ((this.schoolYear?.value as string) ?? '')
            .split('-')
            .join('_');
          const term = (this.termInYear?.value as string) ?? '';

          this.store.dispatch(
            fromAssignSchedule.filter({
              dep,
              params: {
                ss: this.batchInTerm?.value as number,
                term: `${schoolYear}_${term}`,
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
          this.schoolYear?.setValue(
            currentTerm.substr(0, currentTerm.length - 2)
          );
          this.termInYear?.setValue(currentTerm.slice(-1));
        })
      )
      .subscribe();
  }

  private bindTrainingType(): void {
    this.trainingTypes$
      .pipe(
        tap((trainingTypes) => {
          this.trainingType?.setValue(trainingTypes[0]);
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

  private bindDepartment(): void {
    this.myDepartment$
      .pipe(
        ObservableHelper.filterNullish(),
        tap((dep) => {
          this.department?.setValue(dep.id);
        })
      )
      .subscribe();
  }

  private generateSchoolYears(currentTerm: string): string[] {
    const curr = +currentTerm.split('_')[0] + 1;
    const result = [];

    for (let i = 0; i < 3; i++) {
      result.unshift(`${curr - i}_${curr - i + 1}`);
    }

    return result;
  }
}
