import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { GenericState } from '@teaching-scheduling-system/web/shared/data-access/models';
import { ExamService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectNotNullTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { switchMap, takeUntil, tap, withLatestFrom } from 'rxjs';

type ExportDialogState = GenericState<void>;

@Injectable()
export class ExamDialogStore extends ComponentStore<ExportDialogState> {
  /** PRIVATE PROPERTIES */
  private teacher$ = this.appShellStore.pipe(
    selectNotNullTeacher,
    takeUntil(this.destroy$)
  );

  /** PUBLIC PROPERTIES */
  readonly status$ = this.select((s) => s.status);

  /** EFFECTS */
  readonly submit = this.effect<{ id: number; note: string }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      withLatestFrom(this.teacher$),
      switchMap(([{ id, note }, teacher]) =>
        this.examService.updateExamNote(teacher.id, id, { note }).pipe(
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
    super(<ExportDialogState>{});
  }
}
