import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ExamService } from '@services/exam.service';
import { EApiStatus } from '@shared/enums';
import { GenericState, UpdateExamModel } from '@shared/models';
import { switchMap, tap } from 'rxjs/operators';

type EditExamDialogState = GenericState<void>;

@Injectable()
export class EditExamDialogStore extends ComponentStore<EditExamDialogState> {
  /** PUBLIC PROPERTIES */
  public readonly status$ = this.select((s) => s.status);

  /** EFFECTS */
  public readonly update = this.effect<{
    examId: number;
    body: UpdateExamModel;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: EApiStatus.loading, error: null })),
      switchMap((params) =>
        this.examService.update(params.examId, params.body).pipe(
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
  constructor(private readonly examService: ExamService) {
    super(<EditExamDialogState>{ data: null });
  }
}
