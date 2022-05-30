import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ExamService } from '@services/exam.service';
import { EApiStatus } from '@shared/enums';
import { UrlHelper } from '@shared/helpers';
import { GenericState, SearchExam } from '@shared/models';
import { switchMap, tap } from 'rxjs/operators';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';

type ExamDialogState = GenericState<void>;

@Injectable()
export class ExamDialogStore extends ComponentStore<ExamDialogState> {
  /** PUBLIC PROPERTIES */
  public readonly status$ = this.select((s) => s.status);
  public readonly teacher = this.appShellStore.pipe(
    fromAppShell.selectNotNullTeacher
  );

  /** EFFECTS */
  public readonly getExam = this.effect<{
    departmentId: string;
    searchParams: SearchExam;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: EApiStatus.loading, error: null })),
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
                  status: EApiStatus.successful,
                  error: '',
                }),
              (error) =>
                this.patchState({
                  status: EApiStatus.systemError,
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
    private readonly appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super(<ExamDialogState>{ data: null });
  }
}
