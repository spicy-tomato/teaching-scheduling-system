import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { GenericState } from '@teaching-scheduling-system/web/shared/data-access/models';
import { ExamService } from '@teaching-scheduling-system/web/shared/data-access/services';
import { switchMap, tap } from 'rxjs';

type AssignTeacherDialogState = GenericState<void>;

@Injectable()
export class AssignTeacherDialogStore extends ComponentStore<AssignTeacherDialogState> {
  /** PUBLIC PROPERTIES */
  public readonly status$ = this.select((s) => s.status);

  /** EFFECTS */
  public readonly updateProctor = this.effect<{
    examId: number;
    teachersId: string[];
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      switchMap((params) =>
        this.examService.updateProctor(params.examId, params.teachersId).pipe(
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
    super(<AssignTeacherDialogState>{});
  }
}
