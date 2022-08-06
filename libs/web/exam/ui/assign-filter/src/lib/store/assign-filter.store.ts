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
  readonly filterStatus$ = this.examAssignStore.status$;
  readonly teachers = this.appShellStore
    .select(selectTeachersInDepartment)
    .pipe(takeUntil(this.destroy$));
  readonly myDepartment$ = this.appShellStore
    .select(selectDepartment)
    .pipe(ObservableHelper.filterNullish(), takeUntil(this.destroy$));
  readonly currentTerm$ = this.appShellStore
    .select(selectSchoolYear)
    .pipe(takeUntil(this.destroy$));
  readonly academicData$ = this.appShellStore
    .select(selectAcademicData)
    .pipe(takeUntil(this.destroy$));
  readonly trainingTypes$ = this.appShellStore
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
  filter(params: SearchExam): void {
    this.filter$.next(params);
  }

  /** PRIVATE METHODS */
  handleFilter(): void {
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
