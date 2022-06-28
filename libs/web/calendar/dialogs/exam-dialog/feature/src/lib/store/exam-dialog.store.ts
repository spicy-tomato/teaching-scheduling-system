import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  GenericState,
  Note,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { ExamService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectNotNullTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

type ExportDialogState = GenericState<void>;

@Injectable()
export class ExamDialogStore extends ComponentStore<ExportDialogState> {
  /** PRIVATE PROPERTIES */
  private teacher$ = this.appShellStore.pipe(
    selectNotNullTeacher,
    takeUntil(this.destroy$)
  );

  /** PUBLIC PROPERTIES */
  public readonly status$ = this.select((s) => s.status);

  /** EFFECTS */
  public readonly submit = this.effect<{ id: number; note: Note }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: EApiStatus.loading, error: null })),
      withLatestFrom(this.teacher$),
      switchMap(([params, teacher]) =>
        this.examService
          .updateExamNote(teacher.id, params.id, { ...params.note })
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
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(<ExportDialogState>{});
  }
}
