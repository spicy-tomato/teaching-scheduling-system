import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { GenericState } from '@teaching-scheduling-system/web/shared/data-access/models';
import { ExamService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  selectTeachersInDepartment,
  AppShellState,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { switchMap, takeUntil, tap } from 'rxjs';

type AssignTeacherDialogState = GenericState<void>;

@Injectable()
export class AssignTeacherDialogStore extends ComponentStore<AssignTeacherDialogState> {
  // PUBLIC PROPERTIES 
  readonly status$ = this.select((s) => s.status);
  readonly teachers$ = this.appShellStore
    .select(selectTeachersInDepartment)
    .pipe(takeUntil(this.destroy$));

  // EFFECTS 
  readonly updateProctor = this.effect<{
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

  // CONSTRUCTOR 
  constructor(
    private readonly examService: ExamService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(<AssignTeacherDialogState>{});
  }
}
