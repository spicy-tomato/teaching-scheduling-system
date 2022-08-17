import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import {
  GenericState,
  Note,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  ExamService,
  ScheduleService,
} from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectNotNullTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { iif, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs';

type QuickInfoContentState = GenericState<void>;

@Injectable()
export class QuickInfoContentEventStore extends ComponentStore<QuickInfoContentState> {
  // PUBLIC PROPERTIES
  readonly status$ = this.select((s) => s.status);
  private readonly teacherId$ = this.appShellStore.pipe(
    selectNotNullTeacher,
    map((x) => x.id),
    takeUntil(this.destroy$)
  );

  // EFFECTS
  readonly updateNote = this.effect<{
    id: number;
    type: 'exam' | 'study';
    payload: Note;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      withLatestFrom(this.teacherId$),
      switchMap(([{ id, type, payload }, teacherId]) =>
        iif(
          () => type === 'study',
          this.scheduleService.updateStudyNote(id, payload),
          this.examService.updateExamNote(teacherId, id, payload)
        ).pipe(
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
    private readonly scheduleService: ScheduleService,
    private readonly examService: ExamService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(<QuickInfoContentState>{});
  }
}
