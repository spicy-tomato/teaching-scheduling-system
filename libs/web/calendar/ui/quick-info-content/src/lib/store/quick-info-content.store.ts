import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  GenericState,
  Note,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { ScheduleService } from '@teaching-scheduling-system/web/shared/data-access/services';
import { switchMap, tap } from 'rxjs';

type QuickInfoContentState = GenericState<void>;

@Injectable()
export class QuickInfoContentEventStore extends ComponentStore<QuickInfoContentState> {
  // PUBLIC PROPERTIES
  readonly status$ = this.select((s) => s.status);

  // EFFECTS
  readonly updateNote = this.effect<{ id: number; payload: Note }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      switchMap(({ id, payload }) =>
        this.scheduleService.updateStudyNote(id, payload).pipe(
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
  constructor(private readonly scheduleService: ScheduleService) {
    super(<QuickInfoContentState>{});
  }
}
