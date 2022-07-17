import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  GenericState,
  UpdateExamModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { ExamService } from '@teaching-scheduling-system/web/shared/data-access/services';
import { switchMap, tap } from 'rxjs/operators';

type AssignEditExamDialogState = GenericState<void>;

@Injectable()
export class AssignEditExamDialogStore extends ComponentStore<AssignEditExamDialogState> {
  /** PUBLIC PROPERTIES */
  public readonly status$ = this.select((s) => s.status);

  /** EFFECTS */
  public readonly update = this.effect<{
    examId: number;
    body: UpdateExamModel;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      switchMap((params) =>
        this.examService.update(params.examId, params.body).pipe(
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
  constructor(private readonly examService: ExamService) {
    super(<AssignEditExamDialogState>{});
  }
}
