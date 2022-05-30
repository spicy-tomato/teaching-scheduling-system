import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ExamService } from '@services/exam.service';
import { EApiStatus } from '@shared/enums';
import { GenericState } from '@shared/models';
import { switchMap, tap } from 'rxjs/operators';

type AssignExamDialogState = GenericState<void>;

@Injectable()
export class AssignExamDialogStore extends ComponentStore<AssignExamDialogState> {
  /** PUBLIC PROPERTIES */
  public readonly status$ = this.select((s) => s.status);

  /** EFFECTS */
  public readonly updateProctor = this.effect<{
    examId: number;
    teachersId: string[];
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: EApiStatus.loading, error: null })),
      switchMap((params) =>
        this.examService.updateProctor(params.examId, params.teachersId).pipe(
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
    super(<AssignExamDialogState>{ data: null });
  }
}
