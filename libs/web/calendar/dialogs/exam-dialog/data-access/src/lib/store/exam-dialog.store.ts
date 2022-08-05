import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { UrlHelper } from '@teaching-scheduling-system/core/utils/helpers';
import {
  GenericState,
  SearchExam,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { ExamService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectNotNullTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { switchMap, takeUntil, tap } from 'rxjs';

type ExamDialogState = GenericState<void>;

@Injectable()
export class ExamDialogStore extends ComponentStore<ExamDialogState> {
  /** PUBLIC PROPERTIES */
  public readonly status$ = this.select((s) => s.status);
  public readonly teacher = this.appShellStore.pipe(
    selectNotNullTeacher,
    takeUntil(this.destroy$)
  );

  /** EFFECTS */
  public readonly getExam = this.effect<{
    departmentId: string;
    searchParams: SearchExam;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      switchMap((params) =>
        this.examService
          .getDepartmentExamSchedule(
            params.departmentId,
            UrlHelper.queryFilter(params.searchParams, { date: 'between' })
          )
          .pipe(
            tapResponse(
              () =>
                this.patchState({
                  status: 'successful',
                  error: '',
                }),
              (error) =>
                this.patchState({
                  status: 'systemError',
                  error: error as string,
                })
            )
          )
      )
    )
  );

  /** CONSTRUCTOR */
  constructor(
    private readonly examService: ExamService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(<ExamDialogState>{});
  }
}
