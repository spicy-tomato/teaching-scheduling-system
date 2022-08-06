import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { ExamAssignStore } from '@teaching-scheduling-system/web/exam/data-access';
import { SearchExam } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AppShellState,
  selectAcademicData,
  selectDepartment,
  selectSchoolYear,
  selectTeachersInDepartment,
  selectTrainingTypes,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { Subject, takeUntil, tap, withLatestFrom } from 'rxjs';

@Injectable()
export class AssignFilterStore extends ComponentStore<object> {
  /** PUBLIC PROPERTIES */
  public readonly filterStatus$ = this.examAssignStore.status$;
  public readonly teachers = this.appShellStore
    .select(selectTeachersInDepartment)
    .pipe(takeUntil(this.destroy$));
  public readonly myDepartment$ = this.appShellStore
    .select(selectDepartment)
    .pipe(ObservableHelper.filterNullish(), takeUntil(this.destroy$));
  public readonly currentTerm$ = this.appShellStore
    .select(selectSchoolYear)
    .pipe(takeUntil(this.destroy$));
  public readonly academicData$ = this.appShellStore
    .select(selectAcademicData)
    .pipe(takeUntil(this.destroy$));
  public readonly trainingTypes$ = this.appShellStore
    .select(selectTrainingTypes)
    .pipe(takeUntil(this.destroy$));

  /** PRIVATE METHODS */
  private readonly filter$ = new Subject<SearchExam>();

  /** CONSTRUCTOR */
  constructor(
    private readonly examAssignStore: ExamAssignStore,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super();
    this.handleFilter();
  }

  /** PUBLIC METHODS */
  public filter(params: SearchExam): void {
    this.filter$.next(params);
  }

  /** PRIVATE METHODS */
  public handleFilter(): void {
    this.filter$
      .pipe(
        withLatestFrom(this.myDepartment$),
        tap(({ 0: { studySession }, 1: department }) => {
          this.examAssignStore.getExam({
            departmentId: department.id,
            searchParams: { studySession },
          });
        })
      )
      .subscribe();
  }
}
